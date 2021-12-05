import { Form, Input, Button, Checkbox, message, Menu, Modal, Select, Upload } from 'antd'
import Api from '../../api'
import { useEffect, useState } from 'react'
import { SettingFilled, UploadOutlined } from '@ant-design/icons'
import Graph from '../../components/Graph/index'
import { useHistory } from 'react-router-dom'
import { Header } from '../Home'
const { Option } = Select

// function Header() {
//   const history = useHistory()
//   const user = (function () {
//     try {
//       let str = sessionStorage.getItem('user_info')
//       let obj = JSON.parse(str)
//       return obj.name
//     } catch (e) {
//       return 'undefined'
//     }
//   })()
//   return (
//     <div style={{ borderBottom: '1px solid #efefef', display: 'flex', justifyContent: 'end', height: '30px', lineHeight: '30px' }}>
//       <div>欢迎您，{user}！</div>
//       <Button
//         type='link'
//         onClick={() => {
//           sessionStorage.removeItem('user_info')
//           history.replace('/index')
//         }}
//       >
//         登出
//       </Button>
//     </div>
//   )
// }
function Panel({ name, id }) {
  const history = useHistory()
  return (
    <div>
      <div
        onClick={() => {
          history.push({ pathname: '/home', query: { GId: id, GName: name }, search: `GId=${id}&GName=${name}` })
        }}
        style={{
          height: '150px',
          width: '200px',
          borderRadius: '30px',
          margin: '10px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `linear-gradient(#f3e6be, #7c73f0)`,
          boxShadow: '0px 6px 10px ',
          fontSize: '16px',
          fontWeight: '600',
        }}
      >
        {name}
      </div>
    </div>
  )
}
export default function Dashboard() {
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
  const getGraph = async () => {
    const res = await Api.getGraph()
    setMenu(res.data)
  }
  const addGraph = async () => {
    await addForm.validateFields()
    const value = addForm.getFieldsValue()
    try {
      const GName = value.graphName.trim()
      if (!GName.length) {
        message.warning('图表名称不能为空')
        return
      }
    } catch (e) {
      message.warning('图表名称不能为空')
      return
    }

    const data = new FormData()
    Object.entries(value).forEach(([key, value]) => {
      data.append(key, value)
    })
    const res = await Api.createGraph(data)
    if (res?.code === 200100) {
      message.success('图表添加成功')
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
    if (res?.code === 200100) {
      message.success('图表删除成功')
      deleteForm.resetFields()
      await getGraph()
    }
  }
  useEffect(() => {
    getGraph()
  }, [modalVisible])
  return (
    <div>
      <Header></Header>
      <div>
        <div style={{ fontSize: '20px', fontWeight: '600', margin: '0 15px' }}>我的图谱</div>
        <div style={{ display: 'flex', justifyContent: 'start', flexWrap: 'wrap' }}>
          {menu.map((item) => (
            <Panel key={item.id} id={item.id} name={item.graphName}></Panel>
          ))}
        </div>
      </div>

      {/* 浮动小组件 */}
      <div
        onClick={() => {
          setModalVisible(true)
        }}
        style={{ position: 'absolute', bottom: 30, left: 20 }}
      >
        <SettingFilled style={{ fontSize: 20 }} />
      </div>

      <Modal
        title='图表管理'
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false)
        }}
        footer={null}
      >
        <Form
          wrapperCol={{ span: 24 }}
          style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 20px' }}
          form={addForm}
          layout='inline'
        >
          <Form.Item name='graphName' style={{ width: 200 }} label='新建'>
            <Input placeholder='请输入您的图表名称'></Input>
          </Form.Item>
          <Form.Item>
            <Button onClick={addGraph} type='primary'>
              添加
            </Button>
          </Form.Item>
        </Form>
        <Form wrapperCol={{ span: 24 }} style={{ display: 'flex', justifyContent: 'space-between' }} form={deleteForm} layout='inline'>
          <Form.Item name='graphUserID' style={{ width: 200 }} label='删除'>
            <Select placeholder='请选择您的图表名称'>
              {menu.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.graphName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button onClick={deleteGraph} style={{ background: 'red', border: 'white' }} type='primary'>
              删除
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
