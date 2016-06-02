import React,{Component} from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { insert } from '../../api/lists/methods.js';

export default class ListList extends Component {
  constructor(props) {
    super(props);
    this.createNewList = this.createNewList.bind(this);
  }

  createNewList() {
    const listId = insert.call((err) => {
      if (err) {
        /* eslint-disable no-alert */
        alert('Could not create list.');
      }
    });
    const listIdPath = FlowRouter.path('list',{_id:listId});
    FlowRouter.go('/');
  }

  render() {
    const { lists } = this.props;
    return (
      <div className="list-todos">
        <a className="link-list-new" onClick={this.createNewList}>
          <span className="icon-plus"></span>
          New List
        </a>
        {
          lists.map(list => {
            const listPath = FlowRouter.path('list',{_id:list._id});
            return (
                <a href={listPath} key={list._id} className="list-todo" activeClassName="active">
                  {list.userId ? <span className="icon-lock"></span> : null}
                  {list.incompleteCount ? <span className="count-list">{list.incompleteCount}</span> : null}
                  {list.name}
                </a>
            );
          })
        }
      </div>
    );
  }
}

ListList.propTypes = {
  lists: React.PropTypes.array,
};

