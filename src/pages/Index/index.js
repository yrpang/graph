import { Form, Input, Button, Checkbox, message } from 'antd'
import Api from '../../api'
import { useHistory } from 'react-router-dom'
import ButtonGroup from 'antd/lib/button/button-group'
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
        console.log('中文')
        return
      }
    })
    const res = await Api.register(data)
    if (res.code === 200100) {
      message.success('注册成功!')
      history.push('/home')
    } else if (res.code === 500110) {
      message.warning('该用户名已存在！')
    }
  }
  return (
    <div style={{ paddingTop: 100 }}>
      <Form form={form} name='basic' labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} initialValues={{ remember: true }} autoComplete='off'>
        <Form.Item label='用户名' name='name' rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label='密码' name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
          <ButtonGroup>
            <Button type='primary' style={{ marginRight: 20 }} htmlType='submit' onClick={handleRegister}>
              注册
            </Button>
          </ButtonGroup>
        </Form.Item>
      </Form>
    </div>
  )
}
