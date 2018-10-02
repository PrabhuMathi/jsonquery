const R = require("ramda")

const filter = require("./filter")
const sort = require("./sorter")
const grouper = require("./grouper")
const groupReducer = require("./group-reducer")
const groupSorter = require("./group-sorter")
const groupLimiter = require("./group-limiter")

module.exports = {
  filter,
  sort,
  limit(limit, data) {
    return R.take(this.props.limit, data)
  },
  group: grouper,
  groupProcessor(reducer, sortBy, limit, combineRemainder, grouped) {
    return R.pipe(
      function(data) {
        return groupReducer(reducer, data)
      },
      function(data) {
        return groupSorter(sortBy, data)
      },
      function(data) {
        return groupLimiter(limit, combineRemainder, data)
      },
      R.reduce(function(acc, val) {
        acc[val.name] = val.reducer
        return acc
      }, {})
    )(grouped)
  },
}
