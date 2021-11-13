import React from 'react';
import { Menu } from 'antd';
import Graphin, { Behaviors, GraphinContext } from '@antv/graphin';
import { ContextMenu, Toolbar, Tooltip } from '@antv/graphin-components';
import {
    ZoomOutOutlined,
    ZoomInOutlined
} from '@ant-design/icons';
import api from '../api';

const defaultNode = {
    type: 'graphin-circle',
    style: {
        keyshape: {
            fillOpacity: 0.1,
            size: 26,
        },
    },
};

const MyMenu = () => {
    const graphin = React.useContext(GraphinContext);
    const handleClick = () => {
        graphin.contextmenu.node.handleClose();
    };
    return (
        <Menu onClick={handleClick} style={{ width: 156 }} mode="vertical">
            <Menu.Item key="1">
                探索
            </Menu.Item>
        </Menu>
    )
}

const layout = {
    type: 'graphin-force',
    animation: true,
    // preset: {
    //     type: 'concentric', // 力导的前置布局
    // },
    // leafCluster: true, // 是否需要叶子节点聚类
    // nodeClusterBy: 'cluster', // 节点聚类的映射字段
    // clusterNodeStrength: 20, // 节点聚类作用力
};

const handleClick = (graphinContext, config) => {
    const { apis } = graphinContext;
    const { handleZoomIn, handleZoomOut } = apis;
    if (config.key === 'zoomIn') {
        handleZoomIn();
    } else if (config.key === 'zoomOut') {
        handleZoomOut();
    }
};

const options = [
    {
        key: 'zoomOut',
        name: (
            <span>
                放大 <ZoomInOutlined />
            </span>
        ),
        icon: <ZoomInOutlined />,
    },
    {
        key: 'zoomIn',
        name: <ZoomOutOutlined />,
    },
];

const handleMenu = (a, b) => {
    console.log(a);
    console.log(b);
}

function processData(data_src) {
    const data_res = {
        nodes: data_src.nodes.map(n => {
            return {
                id: String(n.id),
                style: {
                    label: {
                        value: n.name,
                        position: 'bottom',
                    },
                    // icon: {
                    //     type: 'text',
                    //     value: n.name,
                    // },
                    // badges: [{
                    //     position: 'RT',
                    //     type: 'text',
                    //     value: n.value,
                    //     size: [15, 15],
                    //     fill: 'red',
                    //     color: '#fff'
                    // }]
                },
                info: {
                    name: n.name,
                    // value: n.value,
                }
            }
        }),
        edges: data_src.edges.map(e => {
            return {
                source: String(e.fromID),
                target: String(e.toID),
                style: {
                },
            }
        })
    }
    return data_res
}

// eslint-disable-next-line 
const { DragCanvas, ZoomCanvas, DragNode, ActivateRelations } = Behaviors;

class Graph extends React.Component {
    constructor(probs) {
        super(probs);
        this.state = {
            graphData: null,
            ifOK: false
        }
    }

    componentDidMount() {
        api.getGraphData(10).then(res => {
            let graphData = processData(res.data);
            this.setState({
                ifOK: true,
                graphData: graphData
            })

        })
    }

    render() {
        if (this.state.ifOK) {
            return (
                <Graphin data={this.state.graphData} layout={layout} defaultNode={defaultNode} fitView="true">
                    <ZoomCanvas disabled />
                    <DragCanvas />
                    <DragNode />
                    <ActivateRelations trigger="click" />
                    <ContextMenu style={{ width: 156 }} bindType="node">
                        <MyMenu onChange={handleMenu} />
                    </ContextMenu>
                    <Toolbar options={options} onChange={handleClick} />
                    <Tooltip bindType="node" placement='right' hasArrow='true' >
                        <Tooltip.Node>
                            {model => {
                                return (
                                    <div className="menu-list">
                                        节点信息
                                        <li>id:{model.id}</li>
                                        <li>name: {model.info.name}</li>
                                        {/* <li>value: {model.info.value}</li> */}
                                    </div>
                                );
                            }}
                        </Tooltip.Node>
                    </Tooltip>
                </Graphin>
            )
        } else {
            return <div>数据正在加载请稍后...</div>
        }

    }
}

export default Graph