import './App.css'
import Index from './pages/Index'
import Home from './pages/Home'
import 'antd/dist/antd.css'
import { BrowserRouter as Router, Switch, Route, Redirect, useLocation } from 'react-router-dom'

const routeConfig = [
  {
    path: '/index',
    component: Index,
    auth: false,
  },
  {
    path: '/home',
    component: Home,
    auth: true,
  },
]

function FrontedAuth() {
  const location = useLocation()
  const result = routeConfig.find((item) => item.path === location.pathname)
  const isLogin = localStorage.getItem('user_info') ? true : false
  if (result && (!result.auth || (result.auth && isLogin))) {
    return isLogin ? (
      <>
        <Redirect to='/home'></Redirect>
        <Route component={Home}></Route>
      </>
    ) : (
      <Route component={result.component} pathname={result.path}></Route>
    )
  } else {
    return <Redirect to='/index'></Redirect>
  }
}

function App() {
  return (
    <div className='App'>
      <Router>
        <Switch>
          <FrontedAuth />
        </Switch>
      </Router>
    </div>
  )
}

export default App
