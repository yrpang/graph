import { Form, Input, Button, Checkbox, message, Menu, Modal, Select, Upload } from 'antd'
import Api from '../../api'
import { useEffect, useState } from 'react'
import { SettingFilled, UploadOutlined } from '@ant-design/icons'

const { Option } = Select
export default function Home() {
  const [menu, setMenu] = useState([])
  const [addForm] = Form.useForm()
  const [deleteForm] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  const [fileList, setFileList] = useState([])
  const [fileList2, setFileList2] = useState([])
  const [graphId, setGraphId] = useState(0)
  const handleUploadRelation = async () => {
    const formData = new FormData()
    formData.append('graphID', graphId)
    formData.append('relationFile', fileList[0], fileList[0].name)
    const res = await Api.uploadRelation(formData)
    if (res.code === 200100) {
      message.success('上传成功')
      setFileList([])
    }
  }
  const handleUploadAttribute = async () => {
    const formData = new FormData()
    formData.append('graphID', graphId)
    formData.append('attributeFile', fileList2[0], fileList2[0].name)
    const res = await Api.uploadAttribute(formData)
    if (res.code === 200100) {
      message.success('上传成功')
      setFileList2([])
    }
  }
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
      <Menu
        style={{ width: 256, height: '100vh' }}
        onClick={(e) => {
          setGraphId(e.key)
        }}
      >
        {menu.map((item) => (
          <Menu.Item key={item.id}>{item.graphName}</Menu.Item>
        ))}
      </Menu>

      {/* 浮动小组件 */}
      <div
        onClick={() => {
          setModalVisible(true)
        }}
        style={{ position: 'absolute', bottom: 30, left: 20 }}
      >
        <SettingFilled style={{ fontSize: 20 }} />
      </div>
      <div
        style={{ position: 'absolute', right: 30, top: 30 }}
        onClick={() => {
          setModalVisible2(true)
        }}
      >
        <UploadOutlined style={{ fontSize: 20 }} />
      </div>
      <Modal
        title='文件上传'
        visible={modalVisible2}
        onCancel={() => {
          setModalVisible2(false)
        }}
        footer={null}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Upload
              maxCount={1}
              fileList={fileList}
              onRemove={(file) => {
                const index = fileList.indexOf(file)
                setFileList(fileList.splice(index, 1))
              }}
              beforeUpload={(file) => {
                setFileList([file])
                return false
              }}
            >
              <Button icon={<UploadOutlined />}>选择关系表</Button>
            </Upload>
            <Button type='primary' onClick={handleUploadRelation} disabled={fileList.length === 0} style={{ marginTop: 16 }}>
              上传关系表
            </Button>
          </div>
          <div>
            <Upload
              maxCount={1}
              fileList={fileList2}
              onRemove={(file) => {
                const index = fileList2.indexOf(file)
                setFileList(fileList2.splice(index, 1))
              }}
              beforeUpload={(file) => {
                setFileList2([file])
                return false
              }}
            >
              <Button icon={<UploadOutlined />}>选择属性表</Button>
            </Upload>
            <Button type='primary' onClick={handleUploadAttribute} disabled={fileList2.length === 0} style={{ marginTop: 16 }}>
              上传属性表
            </Button>
          </div>
        </div>
      </Modal>
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
                <Option value={item.id} key={item.id}>{item.graphName}</Option>
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
