import React,{Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'; // XXX: SESSION
//import { ReactiveVar } from 'meteor/reactive-var';
import {Lists} from '../../api/lists/lists.js';
import ListList from '../components/ListList.jsx';
import UserMenu from '../components/UserMenu.jsx';
import ConnectionNotification from '../components/ConnectionNotification.jsx';
import Loading from '../components/Loading.jsx';

const CONNECTION_ISSUE_TIMEOUT = 5000;

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOpen: false,
            showConnectionIssue: false,
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ showConnectionIssue: true });
        }, CONNECTION_ISSUE_TIMEOUT);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps,this.props)
        const { loading, content } = nextProps;
        // redirect / to a list once lists are ready
        if (!loading && !content()) {
            const list = Lists.findOne();
            FlowRouter.go(FlowRouter.path('list',{_id:list._id}));
        }
        return false;
    }

    toggleMenu(menuOpen = !Session.get('menuOpen')) {
        Session.set({ menuOpen });
    }

    logout() {
        Meteor.logout();
    }

    render() {
        const { showConnectionIssue } = this.state;
        const {user,connected,loading,lists,menuOpen,content} = this.props;
        const closeMenu = this.toggleMenu.bind(this, false);
        return (
            <div id="container" className={menuOpen ? 'menu-open' : ''}>
                <section id="menu">
                    <UserMenu user={user} logout={this.logout}/>
                    <ListList lists={lists}/>
                </section>
                {showConnectionIssue && !connected
                    ? <ConnectionNotification/>
                    : null}
                <div className="content-overlay" onClick={closeMenu}></div>
                <div id="content-container">
                    <ReactCSSTransitionGroup
                        transitionName="fade"
                        transitionEnterTimeout={200}
                        transitionLeaveTimeout={200}
                    >

                        {loading
                            ? <Loading key="loading"/>
                            : content()}
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    user: React.PropTypes.object,      // current meteor user
    connected: React.PropTypes.bool,   // server connection status
    loading: React.PropTypes.bool,     // subscription status
    lists: React.PropTypes.array,      // all lists visible to the current user
    menuOpen: React.PropTypes.bool,    // is side menu open?
    content:React.PropTypes.func,
};