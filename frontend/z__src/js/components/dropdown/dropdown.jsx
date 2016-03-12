var React = require('react');
var Button = require('./button');
var ListItem = require('./list-item');

module.exports = React.createClass({
	handleClick: function (){
		this.setState({open: !this.state.open})
	},
	getInitialState: function () {
		return {open: false}
	},
	handleItemClick: function (item) {
		this.setState({
			open:false,
			itemTitle: item
		});
	},
	render: function (){
		var list = this.props.items.map(function(item, index){
			return <ListItem
					key={index + item.slice(0, 3)}
					item={item} 
					whenItemClicked={this.handleItemClick} 
					className={this.state.itemTitle === item? "active": ""}
					/>
		}.bind(this));

		return <div className="dropdown">
			<Button 
				whenClicked={this.handleClick} 
				className="btn-default" 
				title={this.state.itemTitle || this.props.title} 
				subTitleClassName="caret" 
			/>
			<ul className={"dropdown-menu " + (this.state.open? 'show': '')}>
				{list}
			</ul>
		</div>
	}
})