package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"net/url"
	"time"
	"unicode/utf8"

	"github.com/spf13/viper"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/channel"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/event"
	mspC "github.com/hyperledger/fabric-sdk-go/pkg/client/msp"
	"github.com/hyperledger/fabric-sdk-go/pkg/client/resmgmt"
	"github.com/hyperledger/fabric-sdk-go/pkg/common/errors/retry"
	"github.com/hyperledger/fabric-sdk-go/pkg/common/providers/context"
	"github.com/hyperledger/fabric-sdk-go/pkg/common/providers/msp"
	"github.com/hyperledger/fabric-sdk-go/pkg/core/config"
	"github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"

	"github.com/rs/cors"
)

//var serverChan, clientChan chan string
var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan string)
var inbound = make(chan string)

func main() {

	viper.SetConfigName("config")   // name of config file (without extension)
	viper.AddConfigPath("./config") // optionally look for config in the working directory
	err := viper.ReadInConfig()     // Find and read the config file
	if err != nil {                 // Handle errors reading the config file
		panic(fmt.Errorf("Fatal error config file: %s", err))
	}
	createSetup()
	go watchWebsocketChannels()
	go createEventHub()
	go func() {
		server := newServer()
		if err := server.Start(); err != nil {
			log.Fatal(err.Error())
		}
	}()
	for {
		select {
		case <-time.After(time.Second * 5):
			//	fmt.Println("timeout while waiting for chaincode event")
		}
	}
}

func createSetup() {
	thisConfig := config.FromFile(viper.GetString("fabric.configfile"))
	sdk, err := fabsdk.New(thisConfig)
	//configBackend, err := sdk.Config()
	clientProvider := sdk.Context(fabsdk.WithUser("admin"))
	//endpointConfig, err := fab.ConfigFromBackend(configBackend)
	//u := endpointConfig.NetworkPeers()
	//k, _ := json.Marshal(u)
	//fmt.Println(string(k))
	contextClient, err := clientProvider()
	if err != nil {
		log.Fatalf("error creating p: %v", err)
	}
	orgName := contextClient.IdentityConfig().Client().Organization
	log.Printf("Using Org name to get MSP Client: %v", orgName)
	mspClient, err := mspC.New(clientProvider, mspC.WithOrg(orgName))

	signingIdentity, _ := mspClient.GetSigningIdentity("admin")
	log.Printf("got msp client with signing id mspid: %v", signingIdentity.Identifier().MSPID)

	t, _ := contextClient.LocalDiscoveryProvider().CreateLocalDiscoveryService(signingIdentity.Identifier().MSPID)
	peers, err := t.GetPeers()
	if err != nil {
		log.Printf("error creating peers: %v", err)
	}
	resmgmtClient, err := resmgmt.New(clientProvider)

	if err != nil {
		fmt.Println("failed to create client")
	}
	response, err := resmgmtClient.QueryChannels(resmgmt.WithTargets(peers[0]))
	if err != nil {
		fmt.Printf("failed to query channels: %s\n", err)
	}
	if response != nil {
		fmt.Println("Retrieved channels")
	}
	foundChannel := false
	for x, y := range response.Channels {
		log.Printf("This peer has channel [%v]: %v", x, y.ChannelId)
		if y.ChannelId == viper.GetString("fabric.channel") {
			foundChannel = true
		}
	}
	if !foundChannel {
		log.Printf("Didn't find channel %v - creating it now", viper.GetString("fabric.channel"))
		createChannel(viper.GetString("fabric.channel"), resmgmtClient, signingIdentity)
	}
	//check for chaincode install
	_, _ = resmgmtClient.QueryInstalledChaincodes()
	/*	ccPkg, err := gopackager.NewCCPackage("/opt/gopath/src/github.com/hyperledger/fabric-samples/chaincode/letter-of-credit-chaincode",
			 "")
			if err != nil {
				log.Fatalf("failed to create chaincode package: %v", err)
			}
			fmt.Println("ccPkg created")
		ccPkg.Type=peer.Chain
		installCCReq := resmgmt.InstallCCRequest{Name: setup.ChainCodeID, Path: setup.ChaincodePath, Version: "0", Package: ccPkg}

			   	// Create new resource management client
			   c, err := New(mockClientProvider())
			   if err != nil {
			       fmt.Println("failed to create client")
			   }

			   // Read channel configuration
			   channelConfigPath := filepath.Join(metadata.GetProjectPath(), metadata.ChannelConfigPath, channelConfigFile)
			   r, err := os.Open(channelConfigPath)
			   if err != nil {
			       fmt.Printf("failed to open channel config: %s\n", err)
			   }
			   defer r.Close()

			   // Create new channel 'mychannel'
			   _, err = c.SaveChannel(SaveChannelRequest{ChannelID: "mychannel", ChannelConfig: r})
			   if err != nil {
			       fmt.Printf("failed to save channel: %s\n", err)
			   }

			   peer := mockPeer()

			   // Peer joins channel 'mychannel'
			   err = c.JoinChannel("mychannel", WithTargets(peer))
			   if err != nil {
			       fmt.Printf("failed to join channel: %s\n", err)
			   }

			   // Install example chaincode to peer
			   installReq := InstallCCRequest{Name: "ExampleCC", Version: "v0", Path: "path", Package: &resource.CCPackage{Type: 1, Code: []byte("bytes")}}
			   _, err = c.InstallCC(installReq, WithTargets(peer))
			   if err != nil {
			       fmt.Printf("failed to install chaincode: %s\n", err)
			   }

			   // Instantiate example chaincode on channel 'mychannel'
			   ccPolicy := cauthdsl.SignedByMspMember("Org1MSP")
			   instantiateReq := InstantiateCCRequest{Name: "ExampleCC", Version: "v0", Path: "path", Policy: ccPolicy}
			   _, err = c.InstantiateCC("mychannel", instantiateReq, WithTargets(peer))
			   if err != nil {
			       fmt.Printf("failed to install chaincode: %s\n", err)
			   }

			   fmt.Println("Network setup completed")*/
}
func createChannel(name string, resmgmtClient *resmgmt.Client, si msp.SigningIdentity) {
	req := resmgmt.SaveChannelRequest{
		ChannelID:         name,
		ChannelConfigPath: "./config/awschannel.pb",
		SigningIdentities: []msp.SigningIdentity{si},
	}
	r, err := resmgmtClient.SaveChannel(req)
	if err != nil {
		fmt.Printf("failed to create new channel: %s\n", err)
	} else {
		fmt.Printf("Saved new channel, TX: %v", r.TransactionID)
	}
	err = resmgmtClient.JoinChannel(name, resmgmt.WithRetry(retry.DefaultResMgmtOpts))
	if err != nil {
		fmt.Printf("failed to join new channel: %s\n", err)
	} else {
		fmt.Printf("Joined new channel")
	}
}
func createEventHub() {
	client, close, err := newEventClient(viper.GetString("fabric.channel"), viper.GetString("fabric.configfile"), viper.GetString("fabric.user"))
	if err != nil {
		log.Fatalf("error creating client to build event hub: %v", err)
		return
	}
	defer close()

	reg, channel, err := client.RegisterChaincodeEvent(viper.GetString("fabric.chaincode"), "letterAction")
	if err != nil {
		log.Printf("failed to register chaincode event: %v\n", err)
	}
	defer client.Unregister(reg)
	for {
		select {
		case ccEvent := <-channel:
			broadcast <- `{"ccEvent":` + string(ccEvent.Payload) + `}`
			fmt.Printf("received chaincode event %v\n", ccEvent)
		}
	}
}

type serverType struct {
	router *mux.Router
	url    string
}

func newServer() *serverType {
	return &serverType{
		router: mux.NewRouter(),
		url:    viper.GetString("server.address") + ":" + viper.GetString("server.port"),
	}
}

func (s *serverType) RegisterHTTPHandlers() {
	s.router.HandleFunc("/listLetters", s.httpListLetters)
	s.router.HandleFunc("/letter/{letterId}", s.httpLetterDetail)
	s.router.HandleFunc("/createLetter", s.httpCreateLetter)
	s.router.HandleFunc("/action", s.httpAction)
	s.router.HandleFunc("/deleteAllLetters", s.httpDeleteAllLetters)
	s.router.HandleFunc("/ws", serveWs)
	s.router.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(200) })
	s.router.PathPrefix("/").Handler(http.FileServer(http.Dir("./site/")))
}

func (s *serverType) Start() error {
	s.RegisterHTTPHandlers()
	log.Print(fmt.Sprintf("Listening HTTP on: %s", s.url))
	handler := corsWrap(s.router)

	return http.ListenAndServe(s.url, handler)
}

func (s *serverType) httpListLetters(w http.ResponseWriter, r *http.Request) {
	runCC(w, r, "query", "listLetters", [][]byte{})
}

func (s *serverType) httpCreateLetter(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading body: %v", err)
		http.Error(w, "can't read body", http.StatusBadRequest)
		return
	}
	runCC(w, r, "invoke", "createLetter", [][]byte{body})
}

func (s *serverType) httpAction(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading body: %v", err)
		http.Error(w, "can't read body", http.StatusBadRequest)
		return
	}
	runCC(w, r, "invoke", "action", [][]byte{body})
}

func (s *serverType) httpDeleteAllLetters(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading body: %v", err)
		http.Error(w, "can't read body", http.StatusBadRequest)
		return
	}
	runCC(w, r, "invoke", "deleteAllLetters", [][]byte{body})
}

func (s *serverType) httpLetterDetail(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	runCC(w, r, "query", "getLetter", convertArgs([]string{vars["letterId"]}))
}

func runCC(w http.ResponseWriter, r *http.Request, method string, functionName string, args [][]byte) {
	/*	if (r.Method != http.MethodPost && method == "invoke") ||
		(r.Method != http.MethodGet && method == "query") {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("400: Bad Request"))
		return
	}*/

	var (
		response channel.Response
		req      channel.Request
	)

	req.Fcn = functionName
	req.ChaincodeID = viper.GetString("fabric.chaincode")
	req.Args = args

	client, close, err := newChannelClient(viper.GetString("fabric.channel"), viper.GetString("fabric.configfile"), viper.GetString("fabric.user"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	defer close()
	if method == "query" {
		response, err = client.Query(req)
	} else {
		response, err = client.Execute(req)
	}

	if err != nil {
		log.Printf("Error from fabric client: %v", err)
		+log.Printf("Request was: %v", req)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(response.Payload)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
}

func convertArgs(args []string) [][]byte {
	argBytes := [][]byte{}
	for _, arg := range args {
		argBytes = append(argBytes, []byte(arg))
	}
	return argBytes
}

func corsWrap(handler http.Handler) http.Handler {
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"PUT", "POST", "GET", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		MaxAge:           3200,
		AllowCredentials: true,
	})
	return c.Handler(handler)
}

func newChannelClient(channelName, configPath, user string) (*channel.Client, func(), error) {
	cp, sdkClose := newChannelProvider(channelName, configPath, user)
	channelClient, err := channel.New(cp)
	if err != nil {
		sdkClose()
		return nil, nil, err
	}
	return channelClient, sdkClose, nil
}

func newEventClient(channelName, configPath, user string) (*event.Client, func(), error) {
	cp, sdkClose := newChannelProvider(channelName, configPath, user)
	eventClient, err := event.New(cp, event.WithBlockEvents())
	if err != nil {
		sdkClose()
		return nil, nil, err
	}
	return eventClient, sdkClose, nil
}

func newChannelProvider(channelName, configPath, user string) (context.ChannelProvider, func()) {
	sdk, err := fabsdk.New(config.FromFile(configPath))
	if err != nil {
		return nil, nil
	}
	return sdk.ChannelContext(channelName, fabsdk.WithUser(user)), sdk.Close

}

func watchWebsocketChannels() {
	for {
		select {
		case msg := <-broadcast:
			for client := range clients {
				err := client.WriteMessage(websocket.TextMessage, []byte(msg))
				if err != nil {
					log.Printf("Websocket error: %s", err)
					client.Close()
					delete(clients, client)
				}
			}

		case msg := <-inbound:
			log.Printf("Got inbound socket message: %s", msg)
		}
	}
}

func equalASCIIFold(s, t string) bool {
	for s != "" && t != "" {
		sr, size := utf8.DecodeRuneInString(s)
		s = s[size:]
		tr, size := utf8.DecodeRuneInString(t)
		t = t[size:]
		if sr == tr {
			continue
		}
		if 'A' <= sr && sr <= 'Z' {
			sr = sr + 'a' - 'A'
		}
		if 'A' <= tr && tr <= 'Z' {
			tr = tr + 'a' - 'A'
		}
		if sr != tr {
			return false
		}
	}
	return s == t
}

var defaultPorts = map[string]string{"http": "80", "https": "443"}

func checkSameOrigin(r *http.Request) bool {
	origin := r.Header["Origin"]
	//log.Printf("Checking CORS ORigin: %s", origin)
	if len(origin) == 0 {
		return true
	}
	u, err := url.Parse(origin[0])
	//log.Printf("Checking CORS Origin: %s", u)

	if err != nil {
		return false
	}
	if equalASCIIFold(u.Host, r.Host) {
		return true
	}

	host1, _, err := net.SplitHostPort(u.Host)
	host2, _, err := net.SplitHostPort(r.Host)

	if equalASCIIFold(host1, host2) {
		return true
	}

	defaultPort, ok := defaultPorts[u.Scheme]
	//log.Printf("Checking CORS Origin: %s", defaultPort)

	if !ok {
		return false
	}

	host, port, err := net.SplitHostPort(u.Host)

	if err == nil {
		match := port == defaultPort && equalASCIIFold(host, r.Host)
		log.Printf("Websocket Upgrade CORS: ports match (%s, %s) and (request) hosts match (%s, %s): %v", port, defaultPort, host, r.Host, match)
		return match
	}

	host, port, err = net.SplitHostPort(r.Host)
	if err == nil {
		match := port == defaultPort && equalASCIIFold(u.Host, host)
		log.Printf("Websocket Upgrade CORS: ports match (%s, %s) and (origin) hosts match (%s, %s): %v", port, defaultPort, host, r.Host, match)
		return match
	}

	return false
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     checkSameOrigin,
}

func serveWs(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	// register client
	clients[ws] = true
}
