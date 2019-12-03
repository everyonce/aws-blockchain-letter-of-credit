import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import NoteAdd from '@material-ui/icons/NoteAdd';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import Announcement from '@material-ui/icons/Announcement';
import Paper from '@material-ui/core/Paper';
import SingleOrder from './SingleOrder';
import CreateLetterPanel from './CreateLetterPanel';
import WelcomeLetterPanel from './WelcomeLetterPanel';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  appbar: {
    backgroundColor: '#005A95'
  }
}));

export default function TabBar(props) {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = React.useState(0);
  var orders = ((!props.orders || !Array.isArray(props.orders)) ? []: props.orders)
  .filter(x=>(!!x.data))
  .filter(x=>(!!x.data.description));
  function handleChange(event, newValue) {
    setSelectedTab(newValue);
    console.log("Refreshed tabs: " + orders)
  }
  console.log("Initial tabs: " + JSON.stringify(orders, null, 2))
  return (
    <Paper square className={classes.root}>
      <AppBar className={classes.appbar} position="static" >
        <Tabs centered forceRenderTabPanel={true} value={selectedTab} onChange={handleChange} aria-label="simple tabs example">
          <Tab label='Welcome' {...a11yProps(0)} key={"tabtop-welcome"} icon={<Announcement />} />
            {orders.map((l, index) =>
              <Tab label={l.data.description} {...a11yProps(index+1)} key={"tabtop"+l.id} icon={<InsertDriveFile />} />
            )}
          <Tab label='Create' {...a11yProps(orders.length+1)} key={"tabtop-create"} icon={<NoteAdd />} />
        </Tabs>
      </AppBar>
      <TabPanel value={selectedTab} index={0} key='welcome-letter-tab-panel' >
          <WelcomeLetterPanel config={props.config} />
      </TabPanel>
      {orders.map((l, index) => 
           <TabPanel value={selectedTab} index={index+1} key={'tabpanel-'+l.id}>
             <SingleOrder key={'singleorder-'+l.id} config={props.config} id={l.id} order={l} shipments={props.shipments} />
            </TabPanel>
      )}
        <TabPanel value={selectedTab} index={orders.length+1} key='create-letter-tab-panel' >
            <CreateLetterPanel config={props.config} />
        </TabPanel>
    </Paper>
  );
}

