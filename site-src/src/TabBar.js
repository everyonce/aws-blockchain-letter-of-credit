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
import util from 'util';
import SingleLetter from './SingleLetter';
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

  var letters = (!props.letters || !Array.isArray(props.letters)) ? []: props.letters;
  console.log("letters: " + util.inspect(letters))

  function handleChange(event, newValue) {
    setSelectedTab(newValue);
  }

  return (
    <Paper square className={classes.root}>
      <AppBar className={classes.appbar} position="static" >
        <Tabs centered forceRenderTabPanel={true} value={selectedTab} onChange={handleChange} aria-label="simple tabs example">
        <Tab label='Welcome' {...a11yProps(0)} key={"tabtop-welcome"} icon={<Announcement />} />
        {letters.map((l, index) =>
                <Tab label={l.letterDescription} {...a11yProps(index+1)} key={"tabtop"+l.letterId} icon={<InsertDriveFile />} />
            )}
            <Tab label='Create' {...a11yProps(letters.length+1)} key={"tabtop-create"} icon={<NoteAdd />} />
        </Tabs>
      </AppBar>
      <TabPanel value={selectedTab} index={0} key='welcome-letter-tab-panel' >
            <WelcomeLetterPanel config={props.config} />
        </TabPanel>

      {letters.map((l, index) =>
           <TabPanel value={selectedTab} index={index+1} key={'tabpanel-'+l.letterId}>
             <SingleLetter key={'singleletter-'+l.letterId} config={props.config} letterId={l.letterId} />
            </TabPanel>
         )}
        <TabPanel value={selectedTab} index={letters.length+1} key='create-letter-tab-panel' >
            <CreateLetterPanel config={props.config} />
        </TabPanel>
    </Paper>
  );
}

