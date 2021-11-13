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
                    label: {
                        value: e.name,
                        offset: [0, 0],
                        autoRotate: true
                    },
                },
            }
        })
    }
    return data_res
}

export default processData