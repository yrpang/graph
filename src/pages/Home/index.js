import { Form, Input, Button, Checkbox, message, Menu, Modal, Select } from 'antd'
import Api from '../../api'
import { useEffect, useState } from 'react'
import { SettingFilled } from '@ant-design/icons'

const { Option } = Select
export default function Home() {
  const [menu, setMenu] = useState([])
  const [addForm] = Form.useForm()
  const [deleteForm] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const getGraph = async () => {
    const res = await Api.getGraph()
    setMenu(res.data)
  }
  const addGraph = async () => {
    await addForm.validateFields()
    const value = addForm.getFieldsValue()
    const data = new FormData()
    Object.entries(value).forEach(([key, value]) => {
      data.append(key, value)
    })
    const res = await Api.createGraph(data)
    if (res.code === 200100) {
      message.success('图表删除成功')
      addForm.resetFields()
      await getGraph()
    }
  }
  const deleteGraph = async () => {
    await deleteForm.validateFields()
    const value = deleteForm.getFieldsValue()
    const data = new FormData()
    Object.entries(value).forEach(([key, value]) => {
      data.append(key, Number(value))
    })
    const res = await Api.deleteGraph(data)
    if (res.code === 200100) {
      message.success('图表添加成功')
      deleteForm.resetFields()
      await getGraph()
    }
  }
  useEffect(() => {
    getGraph()
  }, [modalVisible])
  return (
    <div>
      <Menu style={{ width: 256, height: '100vh' }}>
        {menu.map((item) => (
          <Menu.Item key={item.id}>{item.graphName}</Menu.Item>
        ))}
        <div
          onClick={() => {
            setModalVisible(true)
          }}
          style={{ position: 'absolute', bottom: 30, left: 20 }}
        >
          <SettingFilled style={{ fontSize: 20 }} />
        </div>
      </Menu>
      <Modal
        title='图表管理'
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false)
        }}
        footer={null}
      >
        <Form wrapperCol={{ span: 24 }} style={{ display: 'flex', justifyContent: 'space-between' }} form={addForm} layout='inline'>
          <Form.Item name='graphName' style={{ width: 200 }}>
            <Input></Input>
          </Form.Item>
          <Form.Item>
            <Button onClick={addGraph}>添加</Button>
          </Form.Item>
        </Form>
        <Form wrapperCol={{ span: 24 }} style={{ display: 'flex', justifyContent: 'space-between' }} form={deleteForm} layout='inline'>
          <Form.Item name='graphUserID' style={{ width: 200 }}>
            <Select>
              {menu.map((item) => (
                <Option value={item.id}>{item.graphName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button onClick={deleteGraph}>删除</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
