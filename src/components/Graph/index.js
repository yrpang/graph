import React from 'react';
import Graphin, { Behaviors } from '@antv/graphin';

import api from '../../api';
import HideEdge from './HideEdge'
import MyMenu from './MyMenu'
import MyToolbar from './MyToolbar'
import Tooltips from './Tooltips'
import processData from './utils'

const mockData = {
    nodes: [
        {
            id: '4',
            display_name: 'A',
            name: '节点A',
            value: 5,
            weight: 73.355
        },
        {
            id: '5',
            display_name: 'B',
            name: '节点B',
            value: 3,
            weight: 73.355
        },
        {
            id: '6',
            display_name: 'C',
            name: '节点C',
            value: 3,
            weight: 73.355
        },
        {
            id: '7',
            display_name: 'D',
            name: '节点D',
            value: 3,
            weight: 73.355
        }
    ],
    edges: [
        {
            fromID: '4',
            toID: '5',
            name: 'something'
        },
        {
            fromID: '4',
            toID: '6',
            name: 'something'
        },
        {
            fromID: '5',
            toID: '6',
            name: 'something'
        },
        {
            fromID: '4',
            toID: '7',
            name: 'something'
        }
    ]
};

const { DragCanvas, ZoomCanvas, DragNode, ActivateRelations } = Behaviors;

const defaultNode = {
    type: 'graphin-circle',
    style: {
        keyshape: {
            fillOpacity: 0.1,
            size: 26,
        },
    },
};

const layout = {
    type: 'concentric',
    // type: 'graphin-force',
    // animation: true,
    // preset: {
    //     type: 'concentric', // 力导的前置布局
    // },
    // leafCluster: true, // 是否需要叶子节点聚类
    // nodeClusterBy: 'cluster', // 节点聚类的映射字段
    // clusterNodeStrength: 20, // 节点聚类作用力
};


class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            graphData: null,
            ifOK: false,
            ifInitial: true
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.setState({
                ifInitial: false,
                ifOK: false,
                graphData: null
            })
            api.getGraphData(this.props.id).then(res => {
                console.log(this.props.id)
                console.log(res.data)
                let graphData = processData(res.data);
                this.setState({
                    ifInitial: false,
                    ifOK: true,
                    graphData: graphData
                })
            })
        }
        // this.setState({
        //     ifOK: true,
        //     graphData: processData(mockData),
        // })
    }

    render() {
        if (this.state.ifOK && !this.state.ifInitial) {
            return (
                <Graphin data={this.state.graphData} layout={layout} defaultNode={defaultNode} fitView="true">
                    <ZoomCanvas disabled />
                    <DragCanvas />
                    <DragNode />
                    <ActivateRelations trigger="click" />
                    <HideEdge />
                    <MyMenu state={this.state} updateState={this.setState.bind(this)} />
                    <MyToolbar />
                    <Tooltips />
                </Graphin>
            )
        } else if (!this.state.ifInitial) {
            return <div>数据正在加载请稍后...</div>
        } else {
            return <div>请选择要展示的图</div>
        }

    }
}

export default Graph