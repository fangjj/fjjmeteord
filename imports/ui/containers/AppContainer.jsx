import { Meteor } from 'meteor/meteor';
// XXX: Session
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import {Lists} from '../../api/lists/lists.js';
import App from '../layouts/App.jsx';

export default createContainer((props) => {
  const publicHandle = Meteor.subscribe('lists.public');
  const privateHandle = Meteor.subscribe('lists.private');
  const lists = Lists.find().fetch();
  return {
    user: Meteor.user(),
    loading: !(publicHandle.ready() && privateHandle.ready()),
    connected: Meteor.status().connected,
    menuOpen: Session.get('menuOpen'),
    lists:lists,
    content:props.content,
  };
}, App);
