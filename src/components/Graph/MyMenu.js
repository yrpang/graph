import { useEffect, useContext } from 'react';
import { GraphinContext } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';


const { Menu } = ContextMenu;

const menuOptions = [
    {
        key: '2-degree',
        name: '探索二度节点',
    },
    {
        key: 'hide',
        name: '隐藏该点',
    },
]

export default function MyMenu(probs) {
    const { state, updateState } = probs;
    const { graph, apis } = useContext(GraphinContext);
    const oldData = graph.save();
    const handleMenu = (opt, data) => {
        if (opt.key === '2-degree') {
            console.log(data)

            const id = data.id;
            let one_degree = graph.getNeighbors(data.id, "target").filter(n => !n.hasState('hideByUser'));
            let newData = {
                nodes: [],
                edges: []
            }

            one_degree.map(n1 => {
                const id1 = n1.getID();
                let two_degree = graph.getNeighbors(id1, "target").filter(n => !n.hasState('hideByUser'));
                two_degree.map(n2 => {
                    const id2 = n2.getID();
                    if (id2 === id) return null
                    const name = n2.getModel().style.label.value
                    const newNID = `${id}-${id2}`;
                    newData.nodes.push({
                        id: newNID,
                        style: {
                            keyshape: {
                                size: 15,
                                stroke: 'red',
                                fill: 'red',
                            },
                            label: {
                                value: name,
                                position: 'bottom',
                            },
                        },
                        info: {
                            name: name,
                            // value: n.value,
                        }
                    });
                    newData.edges.push({
                        source: id,
                        target: newNID,
                        style: {
                            keyshape: {
                                lineDash: [4, 4],
                                stroke: 'red',
                            },
                        }
                    });
                    return null;
                })
                return null;
            })
            console.log(newData)
            updateState({
                ...state,
                graphData: {
                    nodes: [...state.graphData.nodes, ...newData.nodes],
                    edges: [...state.graphData.edges, ...newData.edges],
                }
            })
        } else if (opt.key === 'hide') {
            const id = data.id;
            const node = graph.findById(id);
            graph.hideItem(node);

            const neighbers = graph.getNeighbors(id).filter(n => !n.hasState('hideByUser'))
            for (const n of neighbers) {
                console.log(n);
                const degree = n.getEdges().filter(i => !i.hasState('hideByUser')).length;
                if (degree === 1) {
                    graph.hideItem(n);
                    n.setState('hideByUser', true);
                    const edges = n.getEdges();
                    for (const e of edges) {
                        e.setState('hideByUser', true);
                    }
                }
            }
            node.setState('hideByUser', true);
            node.getEdges().map(e => e.setState('hideByUser', true));
        }
    }

    return (
        <ContextMenu style={{ width: 156 }} bindType="node">
            <Menu options={menuOptions} onChange={handleMenu} bindType="node" />
        </ContextMenu>
    )
}