import { Form, Input, Button, Checkbox, message } from 'antd'
import Api from '../../api'
import { useHistory } from 'react-router-dom'
import ButtonGroup from 'antd/lib/button/button-group'
import backGround from '../../static/backGround.jpeg'
export default function Index() {
  const history = useHistory()
  const [form] = Form.useForm()
  const handleRegister = async () => {
    await form.validateFields()
    const value = form.getFieldsValue()
    const data = new FormData()
    Object.entries(value).forEach(([key, value]) => {
      if (!/[\u4e00-\u9fa5]/.test(value)) {
        data.append(key, value)
      } else {
        message.error('用户名和密码不能包含中文')
        return
      }
    })
    const res = await Api.register(data)
    if (res?.code === 200100) {
      message.success('注册成功!')
      Api.saveUserInfo(value)
      history.push('/dashboard')
    } else if (res?.code === 500110) {
      message.warning('该用户名已存在！')
    }
  }
  const handleLogin = async () => {
    await form.validateFields()
    const value = form.getFieldsValue()
    Object.entries(value).forEach(([key, value]) => {
      if (/[\u4e00-\u9fa5]/.test(value)) {
        message.error('用户名和密码不能包含中文')
        return
      }
    })

    const res = await Api.login(value)
    if (res?.code === 200100) {
      message.success('登录成功!')
      Api.saveUserInfo(value)
      history.push('/dashboard')
    } else {
      message.error('用户名或密码错误！')
    }
  }
  return (
    <div style={{ backgroundImage: `url(${backGround})`, height: '100vh', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
      <div style={{ paddingTop: 100, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            border: '1px solid #ffffff50',
            boxShadow: '0 4px 10px ',
            borderRadius: '30px',
            margin: '0 200px',
            padding: '100px 20px',
            backgroundColor: '#ffffff90',
          }}
        >
          <div style={{ textAlign: 'center', fontSize: '30px', fontWeight: '600', marginBottom: '50px' }}>知识图谱管理系统</div>
          <div>
            <Form form={form} name='basic' labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} initialValues={{ remember: true }} autoComplete='off'>
              <Form.Item label='用户名' name='name' rules={[{ required: true, message: 'Please input your username!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label='密码' name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item style={{ margin: 'auto', display: 'flex', justifyContent: 'center' }}>
                <ButtonGroup style={{ margin: 'auto', display: 'flex', justifyContent: 'center' }}>
                  <Button style={{ marginRight: 20, background: '#fff', border: '1px solid gray' }} htmlType='submit' onClick={handleRegister}>
                    注册
                  </Button>
                  <Button type='primary' htmlType='submit' onClick={handleLogin}>
                    登录
                  </Button>
                </ButtonGroup>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
