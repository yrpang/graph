import { useEffect, useContext } from 'react';
import { GraphinContext } from '@antv/graphin';

const HideEdge = () => {
    const { graph, apis } = useContext(GraphinContext);

    useEffect(() => {
        const handleClick = (evt) => {
            const node = evt.item;
            const edges = graph.getEdges();
            const edge_conn = node.getEdges();
            const edge_set = new Set();
            edge_conn.map(e => {
                edge_set.add(e.getModel()['id'])
                return null
            })
            edges.map(e => {
                const id = e.getModel().id;
                if (!edge_set.has(id)) {
                    e.hide()
                } else {
                    e.show()
                }
                return null
            })
        };
        const cancelClick = (evt) => {
            const edges = graph.getEdges();
            edges.map(e => {
                if (!e.hasState('hideByUser')) {
                    e.show()
                }
                return null
            })
        }
        // 每次点击聚焦到点击节点上
        graph.on('node:click', handleClick);
        graph.on('canvas:click', cancelClick);
        return () => {
            graph.off('node:click', handleClick);
            graph.off('canvas:click', cancelClick);
        };
    }, [graph]);
    return null;
};

export default HideEdge