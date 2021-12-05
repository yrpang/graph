import { Form, Input, Button, Checkbox, message, Menu, Modal, Select, Upload, Layout } from 'antd'
import Api from '../../api'
import { useEffect, useState } from 'react'
import { SettingFilled, UploadOutlined } from '@ant-design/icons'
import Graph from '../../components/Graph/index'
import './style.css'
import { useHistory, useLocation } from 'react-router-dom'
import Logo from '../../static/logo.png'
const { Option } = Select

const { Sider, Content } = Layout

export function Header() {
  const history = useHistory()
  const user = (function () {
    try {
      let str = sessionStorage.getItem('user_info')
      let obj = JSON.parse(str)
      return obj.name
    } catch (e) {
      return 'undefined'
    }
  })()
  return (
    <div
      style={{ borderBottom: '1px solid #efefef', display: 'flex', justifyContent: 'end', height: '80px', lineHeight: '80px', alignItems: 'center' }}
    >
      <div style={{ flex: 1 }}>
        <img style={{ height: '30px' }} src={Logo} alt='logo' />
      </div>
      <div>欢迎您，{user}！</div>
      <Button
        type='link'
        onClick={() => {
          sessionStorage.removeItem('user_info')
          history.replace('/index')
        }}
      >
        登出
      </Button>
    </div>
  )
}

export default function Home() {
  const location = useLocation()
  const history = useHistory()
  const search = new URLSearchParams(location.search)
  const GId = Number(search.get('GId'))
  const GName = search.get('GName')
  const [modalVisible1, setModalVisible1] = useState(false)
  const [modalVisible3, setModalVisible3] = useState(false)
  const [modalVisible2, setModalVisible2] = useState(false)
  const [fileList, setFileList] = useState([])
  const [fileList2, setFileList2] = useState([])
  const [graphId, setGraphId] = useState(0)
  const [form1] = Form.useForm()
  const [form2] = Form.useForm()
  const [form3] = Form.useForm()
  const [form4] = Form.useForm()
  const [nodeList, setNodeList] = useState([])
  const [relativeList, setRelativeList] = useState([])
  const handleUploadRelation = async () => {
    const formData = new FormData()
    formData.append('graphID', graphId)
    formData.append('relationFile', fileList[0], fileList[0].name)
    const res = await Api.uploadRelation(formData)
    if (res?.code === 200100) {
      message.success('上传成功')
      setFileList([])
    }
  }
  const handleUploadAttribute = async () => {
    const formData = new FormData()
    formData.append('graphID', graphId)
    formData.append('attributeFile', fileList2[0], fileList2[0].name)
    const res = await Api.uploadAttribute(formData)
    if (res?.code === 200100) {
      message.success('上传成功')
      setFileList2([])
    }
  }
  useEffect(() => {
    setGraphId(GId)
  }, [GId])
  const getNodeList = async () => {
    const res = await Api.getNodeList(graphId)
    setNodeList(res.data)
  }
  const handleDeleteNode = async () => {
    await form2.validateFields()
    const res = await form2.getFieldsValue()
    const formData = new FormData()
    formData.append('nodeID', res.nodeID)
    formData.append('graphID', graphId)
    const res2 = await Api.deleteNode(formData)
    if (res2?.code === 200100) {
      message.success(res2.data)
      form2.resetFields()
      getNodeList()
    }
  }
  const handleCreateNode = async () => {
    await form1.validateFields()
    const res = await form1.getFieldsValue()

    const formData = new FormData()
    formData.append('nodeName', res.nodeName)
    formData.append('graphID', graphId)
    const res2 = await Api.createNode(formData)
    if (res2?.code === 200100) {
      message.success(res2.data)
      form1.resetFields()
      getNodeList()
    }
  }
  const getRelativeList = async () => {
    const res = await Api.getRelativeList(graphId)
    setRelativeList(res.data)
  }
  const handleDeleteRelative = async () => {
    await form4.validateFields()
    const res = await form4.getFieldsValue()
    const formData = new FormData()
    formData.append('edgeID', res.edgeID)
    formData.append('graphID', graphId)
    const res2 = await Api.deleteRelative(formData)
    if (res2?.code === 200100) {
      message.success(res2.data)
      form4.resetFields()
      getRelativeList()
    }
  }
  const handleCreateRelative = async () => {
    await form3.validateFields()
    const res = await form3.getFieldsValue()
    const formData = new FormData()
    formData.append('startNodeID', res.startNodeID)
    formData.append('endNodeID', res.endNodeID)
    formData.append('edgeName', res.edgeName)
    formData.append('graphID', graphId)
    const res2 = await Api.createRelative(formData)
    if (res2?.code === 200100) {
      message.success(res2.data)
      form3.resetFields()
      getRelativeList()
    }
  }
  return (
    <div>
      <Header></Header>
      <Layout style={{ height: 'calc(100vh - 80px)' }}>
        <Sider style={{ flex: 1, borderRight: '1px solid #efefef', display: 'flex', flexDirection: 'row', justifyContent: 'center' }} theme='light'>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '20px', fontWeight: '600', margin: '0 15px' }}>{GName}</div>
            <Button
              style={{ margin: '5px 15px' }}
              onClick={() => {
                setModalVisible1(true)
                getNodeList()
              }}
            >
              实体管理
            </Button>
            <Button
              style={{ margin: '5px 15px' }}
              onClick={() => {
                setModalVisible3(true)
                getRelativeList()
              }}
            >
              关系管理
            </Button>
            <Button
              style={{ margin: '5px 15px' }}
              onClick={() => {
                setModalVisible2(true)
              }}
            >
              批量管理
            </Button>
          </div>
          <div>
            <Button
              style={{ margin: '5px 15px', position: 'fixed', bottom: '20px' }}
              onClick={() => {
                history.goBack()
              }}
            >
              返回控制台
            </Button>
          </div>
        </Sider>
        <Content style={{ flex: 1, display: 'flex' }}>
          <div className='container' style={{ flex: 1 }}>
            <div className='graph'>
              <Graph id={graphId}></Graph>
            </div>
          </div>
        </Content>
      </Layout>
      {/* 浮动小组件 */}
      <Modal
        title='实体管理'
        visible={modalVisible1}
        onCancel={() => {
          setModalVisible1(false)
        }}
        footer={null}
      >
        <Form wrapperCol={{ span: 24 }} style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 20px' }} form={form1} layout='inline'>
          <Form.Item name='nodeName' style={{ width: 200 }} label='新建' rules={[{ required: true }]}>
            <Input placeholder='请输入实体名称'></Input>
          </Form.Item>
          <Form.Item>
            <Button type='primary' onClick={handleCreateNode}>
              添加
            </Button>
          </Form.Item>
        </Form>
        <Form wrapperCol={{ span: 24 }} style={{ display: 'flex', justifyContent: 'space-between' }} form={form2} layout='inline'>
          <Form.Item name='nodeID' style={{ width: 200 }} label='删除' rules={[{ required: true }]}>
            <Select placeholder='请选择实体名称'>
              {nodeList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button onClick={handleDeleteNode} style={{ background: 'red', border: 'white' }} type='primary'>
              删除
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title='关系管理'
        visible={modalVisible3}
        onCancel={() => {
          setModalVisible3(false)
        }}
        footer={null}
        width='800px'
      >
        <Form wrapperCol={{ span: 24 }} style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 20px' }} form={form3} layout='inline'>
          <Form.Item name='startNodeID' style={{ width: 200 }} label='新建' rules={[{ required: true }]}>
            <Select placeholder='请选择实体名称'>
              {nodeList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name='edgeName' style={{ width: 200 }} rules={[{ required: true }]}>
            <Input placeholder='请输入关系名称'></Input>
          </Form.Item>
          <Form.Item name='endNodeID' style={{ width: 200 }} rules={[{ required: true }]}>
            <Select placeholder='请选择实体名称'>
              {nodeList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type='primary' onClick={handleCreateRelative}>
              添加
            </Button>
          </Form.Item>
        </Form>
        <Form wrapperCol={{ span: 24 }} style={{ display: 'flex', justifyContent: 'space-between' }} form={form4} layout='inline'>
          <Form.Item name='edgeID' style={{ width: 200 }} label='删除' rules={[{ required: true }]}>
            <Select placeholder='请选择关系'>
              {relativeList.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button style={{ background: 'red', border: 'white' }} type='primary' onClick={handleDeleteRelative}>
              删除
            </Button>
          </Form.Item>
        </Form>
      </Modal>
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
    </div>
  )
}
