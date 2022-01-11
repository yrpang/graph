import { Form, Input, Button, Popover, Checkbox, message, Menu, Modal, Select, Upload } from 'antd'
import Api from '../../api'
import { useEffect, useState } from 'react'
import backGround from '../../static/backGround.jpeg'
import { useHistory } from 'react-router-dom'
import { Header } from '../Home'
import { CloseCircleTwoTone, FolderAddOutlined, UploadOutlined, FileOutlined } from '@ant-design/icons'
const baseUrl = 'https://api.lnception.cn'
function Panel({ name, id, picture, info, setRefresh, refresh, nodeCount, edgeCount }) {
  const history = useHistory()
  const [detectDetail, setDetectDetail] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const deleteGraph = async (value) => {
    const data = new FormData()
    data.append('graphUserID', Number(value))
    const res = await Api.deleteGraph(data)
    if (res?.code === 200100) {
      message.success('图表删除成功')
      setRefresh(!refresh)
    }
  }
  return (
    <div>
      <div
        onClick={() => {
          history.push({ pathname: '/home', query: { GId: id, GName: name }, search: `GId=${id}&GName=${name}` })
        }}
        style={{
          height: '150px',
          width: '90%',
          borderRadius: '30px',
          margin: '20px auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: `#ffffff90`,
          boxShadow: '0px 6px 10px ',
          fontSize: '16px',
          fontWeight: '600',
          position: 'relative',
        }}
      >
        <div>
          {picture ? (
            <img src={`${baseUrl}${picture}`} alt='logo' style={{ width: '80px', height: '80px', borderRadius: '30%', margin: '0 30px' }}></img>
          ) : (
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '30%',
                margin: '0 30px',
                backgroundColor: '#ffffff70',
                fontSize: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {name.slice(0, 1)}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '20px' }}>{name}</div>
          <div>{info === 'undefined' ? ' ' : info}</div>
          <div style={{ fontSize: '12px', fontWeight: '400', color: '#00000080' }}>
            该图谱有{nodeCount}个节点，{edgeCount}条关系边
          </div>
        </div>
        <Popover content={'获取图谱分析报告'} trigger='hover'>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '10%',
              margin: '0 30px',
              backgroundColor: '#ffffff70',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
            onClick={async (e) => {
              e.stopPropagation()
              const data = new FormData()
              data.append('graphID', id)
              const res = await Api.detectGraph(data)
              console.log(res, '!!')
              setModalVisible(true)
              setDetectDetail(res?.data)
            }}
          >
            <FileOutlined />
          </div>
        </Popover>

        <div
          onClick={(e) => {
            e.stopPropagation()
            deleteGraph(id)
          }}
        >
          <CloseCircleTwoTone style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '30px' }} />
        </div>
      </div>
      <Modal
        visible={modalVisible}
        footer={null}
        onCancel={() => {
          setModalVisible(false)
        }}
        title='图谱检测报告'
      >
        {detectDetail.map((item, index) => (
          <div>{`${index + 1}、${item}`}</div>
        ))}
      </Modal>
    </div>
  )
}
function AddPanel({ setRefresh, refresh }) {
  const [addForm] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [fileList, setFileList] = useState([])
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

    const data1 = new FormData()
    data1.append('graphName', value.graphName)

    const res = await Api.createGraph(data1)
    const {
      data: { id },
    } = res
    const data2 = new FormData()
    data2.append('graphUserID', id)
    data2.append('graphInfo', value.graphInfo)
    const data3 = new FormData()
    data3.append('graphUserID', id)
    data3.append('picture', fileList[0])
    await Promise.all([Api.addInfo(data2), Api.addPic(data3)])
    if (res?.code === 200100) {
      console.log(res)
      message.success('图表添加成功')
      addForm.resetFields()
      setFileList([])
      setRefresh(!refresh)
    }
  }
  return (
    <div>
      <div
        onClick={() => {
          setModalVisible(true)
        }}
        style={{
          height: '150px',
          width: '90%',
          borderRadius: '30px',
          margin: '20px auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: `#ffffff`,
          boxShadow: '0px 6px 10px ',
          fontSize: '16px',
          fontWeight: '600',
          position: 'relative',
        }}
      >
        <FolderAddOutlined style={{ fontSize: '30px' }} />
      </div>
      <Modal
        title='添加图表'
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false)
        }}
        footer={null}
      >
        <Form wrapperCol={{ span: 24 }} style={{ justifyContent: 'space-between', margin: '0 0 20px' }} form={addForm}>
          <Form.Item name='graphName' label='名称' rules={[{ required: true }]}>
            <Input placeholder='请输入您的图表名称'></Input>
          </Form.Item>
          <Form.Item name='graphInfo' label='简介'>
            <Input placeholder='请输入您的图表简介'></Input>
          </Form.Item>
          <Form.Item name='picture' label='图标'>
            <Upload
              maxCount={1}
              fileList={fileList}
              listType='picture-card'
              beforeUpload={(file) => {
                setFileList([file])
                return false
              }}
              onRemove={(file) => {
                const index = fileList.indexOf(file)
                console.log(file, '@@@', index)

                setFileList([])
              }}
            >
              {fileList.length > 0 ? null : <UploadOutlined />}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button onClick={addGraph} type='primary' style={{ width: '100%' }}>
              添加
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default function Dashboard() {
  const [menu, setMenu] = useState([])
  const [addForm] = Form.useForm()
  const [deleteForm] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const getGraph = async () => {
    const res = await Api.getGraph()
    setMenu(res?.data)
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

  useEffect(() => {
    getGraph()
  }, [modalVisible, refresh])
  return (
    <div>
      <Header></Header>
      <div
        style={{
          backgroundImage: `url(${backGround})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        }}
      >
        <div style={{ fontSize: '20px', fontWeight: '600', padding: '20px 15px 0', color: '#ffffff' }}>我的图谱</div>
        <div>
          {menu.map((item) => (
            <Panel
              key={item.id}
              id={item.id}
              name={item.graphName}
              picture={item.picAddr}
              info={item.info}
              setRefresh={setRefresh}
              refresh={refresh}
              nodeCount={item.nodeCount}
              edgeCount={item.edgeCount}
            ></Panel>
          ))}
          <AddPanel setRefresh={setRefresh} refresh={refresh}></AddPanel>
        </div>
      </div>
    </div>
  )
}
