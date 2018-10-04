const React = require("react")
const PropTypes = require("prop-types")
const createReactClass = require("create-react-class")

const GroupingModal = createReactClass({
  displayName: "GroupingModal",

  propTypes: {
    onDismiss: PropTypes.func.isRequired,
    groupings: PropTypes.array,
    onGroupReducerChange: PropTypes.func.isRequired,
    onGroupSortChange: PropTypes.func.isRequired,
    onGroupLimitChange: PropTypes.func.isRequired,
    onCombineRemainderChange: PropTypes.func.isRequired,
    groupReducer: PropTypes.object,
    groupSort: PropTypes.string.isRequired,
    groupLimit: PropTypes.number,
    combineRemainder: PropTypes.bool.isRequired,
  },

  onReset() {
    if (window.confirm("Are you sure you want to reset grouping options?")) {
      this.props.onGroupReducerChange(null)
      this.props.onDismiss()
    }
  },

  onGroupReducerChange(e) {
    const groupReducer = (e.target.value && e.target.value.length) ? {name: e.target.value} : null
    this.props.onGroupReducerChange(groupReducer)
  },

  onSortChange(e) {
    this.props.onGroupSortChange(e.target.value)
  },

  onLimitChange(e) {
    const groupLimit = (e.target.value && e.target.value.length) ? parseInt(e.target.value, 10) : null
    this.props.onGroupLimitChange(groupLimit)
  },

  onCombineRemainderChange() {
    this.props.onCombineRemainderChange(!this.props.combineRemainder)
  },

  getReducerOption() {
    if (!this.props.groupings || !this.props.groupings.length) return null
    const value = this.props.groupReducer ? this.props.groupReducer.name : ""

    return (
      <div className="input-control">
        <label>Reduce By:</label>
        <div className="body">
          <div className="row">
            <select onChange={this.onGroupReducerChange} value={value}>
              <option value=""></option>
              <option value="count">Length</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>
        </div>
      </div>
    )
  },

  getSortOptions() {
    let options = [
      {value: "desc", name: "Count DESC"},
      {value: "asc", name: "Count ASC"},
      {value: "namedesc", name: "Name DESC"},
      {value: "nameasc", name: "Name ASC"},
    ]

    if (this.props.groupings.length > 1) {
      options = options.concat([
        {value: "pathdesc", name: "Path DESC"},
        {value: "pathasc", name: "Path ASC"},
      ])
    }

    if (this.props.groupings.length === 1) {
      options = options.concat([
        {value: "natural", name: "Natural"},
      ])
    }

    const disabled = !this.props.groupReducer

    return (
      <div className="input-control">
        <label>Sort By:</label>
        <div className="body">
          <div className="row">
            <select disabled={disabled} onChange={this.onSortChange} value={this.props.groupSort || ""}>
              {options.map(function(option) {
                return <option key={option.value} value={option.value}>{option.name}</option>
              })}
            </select>
          </div>
        </div>
      </div>
    )
  },

  getLimitOptions() {
    const combineRemainderInput = (this.props.groupLimit) ? (
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="combineRemainder"
          checked={this.props.combineRemainder}
          onChange={this.onCombineRemainderChange}
        />
        Combine remainder
      </label>) : null

    const disabled = !this.props.groupReducer

    return (
      <div className="input-control">
        <label>Limit By:</label>
        <div className="body">
          <div className="row">
            <select disabled={disabled} onChange={this.onLimitChange} value={this.props.groupLimit || ""}>
              <option value="">Show all</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12">12</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="75">75</option>
              <option value="100">100</option>
              <option value="150">150</option>
              <option value="200">200</option>
              <option value="250">250</option>
              <option value="500">500</option>
            </select>
            {combineRemainderInput}
          </div>
        </div>
      </div>
    )
  },

  render() {
    return (
      <div>
        <div className="overlay" />
        <div className="modal">
          <div className="modal-content">
            <div className="modal-body">
              <h3>Grouping Options</h3>
              {this.getReducerOption()}
              {this.getSortOptions()}
              {this.getLimitOptions()}
            </div>
            <div className="modal-footer">
              <ul className="side-options right">
                {this.props.groupReducer && <li><a className="site-link" onClick={this.onReset}>Reset</a></li>}
                <li><a className="site-link" onClick={this.props.onDismiss}>OK</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  },
})

module.exports = GroupingModal
