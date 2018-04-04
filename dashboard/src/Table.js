import React, { Component } from 'react';
import Loading from './Loading';
import Pagination from './Pagination';

export class Col extends Component {
  render() {
    return (
      <td className={this.props.className}>
        {this.props.data}
      </td>
    )
  }
}

export class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      itemsPerPage: 10
    };

    ['changePage', 'changeItemsPerPage']
    .forEach(method => this[method] = this[method].bind(this));
  }

  changePage(page) {
    this.setState({currentPage : page})
  }

  changeItemsPerPage(itemsPerPage) {
    var newCurrentPage = this.state.currentPage;
    const newLastPage = Math.ceil(this.props.keys.length / itemsPerPage);
    if (newLastPage < newCurrentPage) {
      newCurrentPage = newLastPage;
    }
    this.setState({itemsPerPage: itemsPerPage, currentPage: newCurrentPage});
  }

  paginatedData(data) {
    return data.slice((this.state.currentPage - 1) * this.state.itemsPerPage, this.state.currentPage * this.state.itemsPerPage)
  }

  render() {
    return (
      <table>
        <colgroup>
          {this.props.children.map((c, i) => <col key={i} width={c.props.width} />)}
        </colgroup>
        <thead>
          <tr>
            <th>Url</th>
            <th className="center">Count</th>
          </tr>
        </thead>
        <tbody>
          {
            !this.props.loading ?
              this.paginatedData(this.props.keys.sort((j, k) => !(this.props.rawMap[j] > this.props.rawMap[k])))
                  .map((k, index) =>
                    <tr className={index % 2 === 0 ? 'even-row' : 'odd-row'} key={k}>
                      {
                        this.props.children.map((c, i) =>
                          <Col key={c + i} className={c.props.className}
                            data={c.props.data(this.props.rawMap, k)}
                          />
                        )
                      }
                    </tr>
                  )
              :
              <tr>
                <td colSpan="2">
                  <Loading altText='loading...' />
                </td>
              </tr>
          }
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>
              <Pagination
                  dataLength={this.props.keys.length}
                  currentPage={this.state.currentPage}
                  itemsPerPage={this.state.itemsPerPage}
                  onChangePage={this.changePage}
                  onChangeItemsPerPage={this.changeItemsPerPage}
              />
            </td>
          </tr>
        </tfoot>
      </table>
    )
  }
}