// this is an example of improting data from JSON
import orders from '../data/orders.json';
import users from '../data/users.json';
import companies from '../data/companies.json';

export default (function () {

    var $tablebody = document.querySelector('#orders');
    var $table = document.querySelector('table');


    function dateParser(date) {
        let myDate = new Date(+date);
        let year = myDate.getFullYear();
        let month = myDate.getMonth();
        let day = myDate.getDay();
        let time = myDate.toLocaleString("en-US", {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,

        });
        return `${day + 1}/${month + 1}/${year}, ${time}`
    }


    //Task_1 

    for (var i = 0; i < orders.length; i++) {
        var el = document.createElement('tr');
        el.setAttribute('id', `order_${orders[i].id}`);
        el.innerHTML = `<td>${orders[i].transaction_id}</td>
        <td class='user-data'>${orders[i].user_id}</td>
        <td>${dateParser(orders[i].created_at)}</td>
        <td>${orders[i].total}</td>
        <td>${orders[i].card_number.slice(0, 2)}********${orders[i].card_number.slice(-4)}</td>
        <td>${orders[i].card_type}</td>
        <td>${orders[i].order_country} (${orders[i].order_ip})</td>`
        $tablebody.append(el);
    }

    var userInfoIDs = document.querySelectorAll('.user-data');

    //Task_2 

    for (var j = 0; j < userInfoIDs.length; j++) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == userInfoIDs[j].innerHTML) {
                var userNameTemplate;
                if (users[i].gender == 'Male') {
                    userNameTemplate = `<a href='#' class='user-link'>Mr. ${users[i].first_name} ${users[i].last_name}</a>`;
                } else {
                    userNameTemplate = `<a href='#' class='user-link'>Ms. ${users[i].first_name} ${users[i].last_name}</a>`;
                }
                userInfoIDs[j].dataset.user_id = users[i].id;
                userInfoIDs[j].innerHTML = userNameTemplate;
            }
        }
    }

    //Task_3

    for (var j = 0; j < userInfoIDs.length; j++) {
        var extendedUserInfo = document.createElement('div');
        extendedUserInfo.classList.add('user-details');
        extendedUserInfo.classList.add('hide');
        for (var k = 0; k < users.length; k++) {
            if (users[k].id == userInfoIDs[j].dataset.user_id) {
                if (users[k].company_id) {
                    for (var i = 0; i < companies.length; i++) {
                        if (users[k].company_id == companies[i].id) {
                            extendedUserInfo.innerHTML = makeUserInfoTemp(users[k], companies[i])
                        }
                    }
                } else {
                    extendedUserInfo.innerHTML = makeUserInfoTemp(users[k], null)
                }
            }

        }
        userInfoIDs[j].append(extendedUserInfo);
    }

    function makeUserInfoTemp(user, company) {
        if (company) {
            return `<p>Birthday: ${convertDate(user.birthday)}</p>
                    <p><img src="${user.avatar}" width="100px"></p>
                    <p>Company: <a href="${company.url}" target="_blank">${company.title}</a></p>
                    <p>Industry: ${company.industry}</p>`
        } else {
            return `<p>Birthday: ${convertDate(user.birthday)}</p>
                    <p><img src="${user.avatar}" width="100px"></p>`;
        }

    }


    function convertDate(inputFormat) {
        var date = new Date(+inputFormat);
        var options = {
            year: 'numeric', month: 'numeric', day: 'numeric',
        };

        var result = date.toLocaleDateString('it', options);
        return result;
    }

    $tablebody.addEventListener('click', function (event) {
        var targetElem = event.target;
        if (targetElem.classList.contains("user-link")) {
            targetElem.nextSibling.classList.toggle('hide');
        }
    });


    //Task_4

    $table.onclick = function (e) {
        if (e.target.tagName != 'TH' || !e.target.hasAttribute('data-type')) return;

        var arrowSign = e.target.childNodes[1];
        arrowSign.classList.remove('hide');
        sortTable($table, e.target.cellIndex, e.target.getAttribute('data-type'), e.target.cellIndex);
    };

    function sortTable(table, col, type, colNum) {
        var rowsArray = [].slice.call($tablebody.rows);
        function compare(rowA, rowB) {
            if (isNaN(+rowA.cells[colNum].innerHTML) || isNaN(+rowB.cells[colNum].innerHTML)) {
                return +Date.parse(rowA.cells[colNum].innerHTML) - +Date.parse(rowB.cells[colNum].innerHTML);
            } else {
                return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
            }
        }
        switch (type) {
            case 'string':
                var tb = table.tBodies[0], i;
                rowsArray = rowsArray.sort(function (a, b) {
                    return (a.cells[col].textContent.trim()
                        .localeCompare(b.cells[col].textContent.trim())
                    );
                });
                for (var i = 0; i < rowsArray.length; ++i) tb.appendChild(rowsArray[i]);
                break;

            case 'number':
                rowsArray.sort(compare);
                $table.removeChild($tablebody);
                for (var i = 0; i < rowsArray.length; i++) {
                    $tablebody.appendChild(rowsArray[i]);
                }
                $table.appendChild($tablebody);
                break;

            case 'customString':
                var tb = table.tBodies[0], i;
                rowsArray = rowsArray.sort(function (a, b) {
                    return (a.cells[col].textContent.trim().slice(4)
                        .localeCompare(b.cells[col].textContent.trim().slice(4))
                    );
                });
                for (var i = 0; i < rowsArray.length; ++i) tb.appendChild(rowsArray[i]);
                break;
        }
    }

    //Task_5

    class OrderStatistic {
        constructor() {
            this.rowsArray = [].slice.call(document.querySelector('#orders').rows);
            this.arrOrdersSum = this.rowsArray.map(function (elem) {
                return +elem.cells[3].innerHTML;
            });
        }

        ordersCount() {
            return this.rowsArray.length;
        }

        ordersTotal() {
            return (this.arrOrdersSum.reduce((accumulator, currentValue) => accumulator + currentValue)).toFixed(2);
        }

        medianValue() {
            var sortedOrdersVal = this.arrOrdersSum.sort((a, b) => a - b);
            if (this.ordersCount() % 2 === 0) {
                return (sortedOrdersVal[this.ordersCount() / 2] + sortedOrdersVal[this.ordersCount() / 2 + 1]) / 2;
            } else {
                return sortedOrdersVal[Math.floor(this.ordersCount() / 2)];
            }

        }

        avgCheck() {
            return (this.ordersTotal() / this.ordersCount()).toFixed(2);
        }

        avgCheckFml() {
            var arrFml = this.rowsArray.filter(function (row) {
                if (row.cells[1].innerText.slice(0, 2) == 'Ms') {
                    return true;
                }
            });
            var currentSum = 0;

            arrFml.forEach((elem) => currentSum += +elem.cells[3].innerHTML);

            return (currentSum / arrFml.length).toFixed(2);
        }

        avgCheckMl() {
            var arrMl = this.rowsArray.filter(function (row) {
                if (row.cells[1].innerText.slice(0, 2) == 'Mr') {
                    return true;
                }
            });
            var currentSum = 0;

            arrMl.forEach((elem) => currentSum += +elem.cells[3].innerHTML);

            return (currentSum / arrMl.length).toFixed(2);
        }
    }

    function task_5(emptyDataSet) {
        if (emptyDataSet) {
            document.querySelector('#statistic-orders').innerHTML = `<tr>
            <td>Orders Count</td>
            <td><span>n/a</span></td>
        </tr>
        <tr>
            <td>Orders Total</td>
            <td><span>n/a</span></td> 
        </tr>
        <tr>
            <td>Median Value</td>
            <td><span>n/a</span></td>
        </tr>
        <tr>
            <td>Average Check</td>
            <td><span>n/a</span></td>
        </tr>
        <tr>
            <td>Average Check (Female)</td>
            <td><span>n/a</span></td>
        </tr>
        <tr>
            <td>Average Check (Male)</td>
            <td><span>n/a</span></td>
        </tr>`;
        }
        var statOrder = new OrderStatistic();
        var statisticTemplate = `<tr>
        <td>Orders Count</td>
        <td>${statOrder.ordersCount()}</td>
    </tr>
    <tr>
        <td>Orders Total</td>
        <td>$ ${statOrder.ordersTotal()}</td> 
    </tr>
    <tr>
        <td>Median Value</td>
        <td>$ ${statOrder.medianValue()}</td>
    </tr>
    <tr>
        <td>Average Check</td>
        <td>$ ${statOrder.avgCheck()}</td>
    </tr>
    <tr>
        <td>Average Check (Female)</td>
        <td>$ ${statOrder.avgCheckFml()}</td>
    </tr>
    <tr>
        <td>Average Check (Male)</td>
        <td>$ ${statOrder.avgCheckMl()}</td>
    </tr>`;
        document.querySelector('#statistic-orders').innerHTML = statisticTemplate;
    }
    task_5();

    //Task_5
    var searchValue = document.querySelector('#search');
    searchValue.addEventListener('input', searchOrders);
    var rowsArray = [].slice.call($tablebody.rows);

    function searchOrders() {

        var newOrdersArray = [], isRecordExist = false;
        for (var i = 0; i < rowsArray.length; i++) {
            for (var j = 0; j < rowsArray[i].cells.length; j++) {
                if (rowsArray[i].cells[j].innerText.includes(this.value)) {
                    if (j === 2 || j === 4) continue;
                    newOrdersArray.push(rowsArray[i]);
                    isRecordExist = true;
                }
            }
        }
        if (!isRecordExist) {
            $tablebody.innerHTML = `<tr>
            <td style='color:red;'>Nothing found</td>
        </tr>`;
            task_5(true);
            return;
        }
        $tablebody.innerHTML = '';
        for (var i = 0; i < newOrdersArray.length; i++) {
            $tablebody.appendChild(newOrdersArray[i]);
        }
        $table.appendChild($tablebody);
        task_5();
    }
}());