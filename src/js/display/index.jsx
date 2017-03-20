const React = require("react")
const R = require("ramda")
const queryString = require("query-string")

const formatter = require("../helpers/formatter")

const Filters = require("./filters")
const Controls = require("./controls")
const Summary = require("./summary")
const Results = require("./results")

const Display = React.createClass({
  displayName: "Display",

  propTypes: {
    actionCreator: React.PropTypes.object.isRequired,
    filters: React.PropTypes.array.isRequired,
    groupBy: React.PropTypes.string,
    sortBy: React.PropTypes.string,
    sortDirection: React.PropTypes.string,
    schema: React.PropTypes.object.isRequired,
    data: React.PropTypes.array.isRequired,
    resultFields: React.PropTypes.array.isRequired,
    showCounts: React.PropTypes.bool.isRequired,
    limit: React.PropTypes.number,
    sum: React.PropTypes.string,
    average: React.PropTypes.string,
  },

  onBackClick: function() {
    this.props.actionCreator.goBack()
  },

  filterResults: function(data) {
    return formatter.filter(data, this.props.schema, this.props.filters)
  },

  sortResults: function(data) {
    return (this.props.sortBy) ? formatter.sort(this.props.sortBy, this.props.sortDirection, data) : data
  },

  limitResults: function(data) {
    return (this.props.limit) ? R.take(this.props.limit, data) : data
  },

  pickIncludedFields: function(data) {
    return R.map(R.pickAll(R.sortBy(R.identity, this.props.resultFields)))(data)
  },

  filterSortAndLimit: function(data) {
    return R.pipe(
      this.filterResults,
      this.sortResults,
      this.limitResults,
      this.pickIncludedFields
    )(data)
  },

  formatData: function(data) {
    if (this.props.groupBy) return formatter.group([this.props.groupBy], this.props.showCounts, data)
    if (this.props.sum) return {total: formatter.round(2, R.sum(R.pluck(this.props.sum, data)))}
    if (this.props.average) return {average: formatter.round(2, R.mean(R.pluck(this.props.average, data)))}
    return data
  },

  getGoBackLink: function() {
    const parsed = queryString.parse(location.search)

    if (parsed.dataUrl && parsed.schema) return null
    return <p><a className="site-link" onClick={this.onBackClick}>Go back</a></p>
  },

  render: function() {
    const filtered = this.filterSortAndLimit(this.props.data)
    const results = this.formatData(filtered)

    return (
      <div>
        {this.getGoBackLink()}
        <Filters
          actionCreator={this.props.actionCreator}
          filters={this.props.filters}
          schema={this.props.schema}
        />
        <Controls
          actionCreator={this.props.actionCreator}
          filters={this.props.filters}
          schema={this.props.schema}
          groupBy={this.props.groupBy}
          sortBy={this.props.sortBy}
          sortDirection={this.props.sortDirection}
          showCounts={this.props.showCounts}
          limit={this.props.limit}
          sum={this.props.sum}
          average={this.props.average}
        />
        <Summary
          rawDataLength={this.props.data.length}
          results={filtered}
          groupBy={this.props.groupBy}
        />
        <Results
          results={results}
          groupBy={this.props.groupBy}
          resultFields={this.props.resultFields}
          schema={this.props.schema}
          actionCreator={this.props.actionCreator}
          showCounts={this.props.showCounts}
          filteredLength={filtered.length}
          sum={this.props.sum}
          average={this.props.average}
        />
      </div>
    )
  },
})

module.exports = Display