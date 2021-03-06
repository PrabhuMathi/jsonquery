const React = require("react")
const PropTypes = require("prop-types")
const CopyToClipboard = require("react-copy-to-clipboard").CopyToClipboard

const R = require("ramda")

function TableDisplay(props) {

  function onDownload() {
    props.onDownload(props.downloadFormat)
  }

  function getHeaderCopyText(index) {
    return R.pipe(
      R.reject(R.propEq("type", "header")),
      R.map(R.compose(R.prop(index), R.prop("cols"))),
      R.join(",")
    )(props.formatted)
  }

  const header = R.find(R.propEq("type", "header"), props.formatted)

  let tableHeader = null

  if (header) {
    const headerRow = header.cols.map(function(col, index) {
      return (
        <th key={index} className="clickable" title="Copy column data">
          <CopyToClipboard text={getHeaderCopyText(index)} onCopy={props.showToast}><span>{col}</span></CopyToClipboard>
        </th>
      )
    })

    tableHeader = <thead><tr>{headerRow}</tr></thead>
  }

  const dataRows = R.reject(R.propEq("type", "header"), props.formatted)

  const tableBodyRows = dataRows.map(function(row, index) {
    if (row.type === "title") {
      return (
        <tr key={index}>
          <td colSpan={row.span} style={{fontWeight: "bold"}}>{row.cols[0]}</td>
        </tr>
      )
    }

    const cols = row.cols.map(function(col, index) {
      if (typeof col === "boolean") col = col.toString()
      return <td key={index}>{col}</td>
    })

    return <tr key={index}>{cols}</tr>
  })

  const downloadLinks = []

  if (props.showToast) {
    downloadLinks.push(
      (
        <li key="copy"><a className="site-link">
          <CopyToClipboard text={props.downloadFormat} onCopy={props.showToast}>
            <span>Copy To Clipboard</span>
          </CopyToClipboard></a>
        </li>
      )
    )
  }

  downloadLinks.push(
    (
      <li key="download"><a className="site-link" onClick={onDownload}>Download</a></li>
    )
  )

  return (
    <div>
      <ul className="side-options right">{downloadLinks}</ul>
      <table className="table">
        {tableHeader}
        <tbody>
          {tableBodyRows}
        </tbody>
      </table>
    </div>
  )
}

TableDisplay.propTypes = {
  formatted: PropTypes.any.isRequired,
  downloadFormat: PropTypes.any.isRequired,
  onDownload: PropTypes.func.isRequired,
  showToast: PropTypes.func,
}

module.exports = TableDisplay
