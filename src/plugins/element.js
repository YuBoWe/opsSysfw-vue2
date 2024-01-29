import Vue from 'vue'
import {
  Form, FormItem, Input, Button, Container,
  Header, Aside, Main, Menu, MenuItem, Submenu, Breadcrumb,
  BreadcrumbItem, Table, TableColumn, Pagination, Dialog,
  Row, Col, Card, Switch, Message, MessageBox, Tooltip,
  Dropdown, DropdownItem, DropdownMenu, Tree
} from 'element-ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Dropdown)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Tree)

Vue.prototype.$message = Message
Vue.prototype.$msgBox = MessageBox