import React from 'react';
import Graphin, { Behaviors } from '@antv/graphin';

import api from '../../api';
import HideEdge from './HideEdge'
import MyMenu from './MyMenu'
import MyToolbar from './MyToolbar'
import Tooltips from './Tooltips'
import processData from './utils'

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
    constructor(probs) {
        super(probs);
        this.state = {
            graphData: null,
            ifOK: false
        }
    }

    componentDidMount() {
        api.getGraphData(10).then(res => {
            console.log(res.data)
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
                    <HideEdge />
                    <MyMenu />
                    <MyToolbar />
                    <Tooltips />
                </Graphin>
            )
        } else {
            return <div>数据正在加载请稍后...</div>
        }

    }
}

export default Graph