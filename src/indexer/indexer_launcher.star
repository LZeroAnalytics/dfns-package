def launch_indexer(plan, rpc_url, env):
    graph = import_module("github.com/LZeroAnalytics/graph-package@{}/main.star".format(env))

    # Spin up graph node for network
    graph_output = graph.run(plan, rpc_url=rpc_url, env=env)

    graph_rpc_url = "http://{}:{}".format(graph_output.graph.hostname, graph_output.graph.ports["rpc"].number)
    graph_ipfs_url = "http://{}:{}".format(graph_output.ipfs.hostname, graph_output.ipfs.ports["rpc"].number)

    # Wait for rpc to be available
    rpc_recipe = GetHttpRequestRecipe(
        endpoint="/",
        port_id="rpc",
    )

    plan.wait(
        service_name="graph-node",
        recipe=rpc_recipe,
        field="code",
        assertion="==",
        target_value=405,
        interval="2s",
        timeout="2m",
        description="Waiting for Graph node to be available"
    )

    subgraph_folder = plan.upload_files(
        src = "./subgraph",
        name = "subgraph",
        description = "Uploading subgraph"
    )

    subgraph_name = "bloctopus/indexer"
    create_cmd = "graph create {} --node {}".format(subgraph_name, graph_rpc_url)
    deploy_cmd = "cd /subgraph && yarn install && graph codegen && graph build && graph deploy {} --node {} --ipfs {} --version-label v1.0.0".format(subgraph_name, graph_rpc_url, graph_ipfs_url)

    # Create subgraph
    plan.run_sh(
        run = create_cmd,
        name = "subgraph-creator",
        image = "tiljordan/graph-cli:1.0.0",
        description = "Creating subgraph"
    )

    # Deploy subgraph
    plan.run_sh(
        run = deploy_cmd,
        name = "subgraph-deployer",
        image = "tiljordan/graph-cli:1.0.0",
        description = "Deploying subgraph",
        files = {
            "/subgraph": subgraph_folder
        }
    )

    graph_http_url = "http://{}:{}/subgraphs/name/{}".format(graph_output.graph.hostname, graph_output.graph.ports["http"].number, subgraph_name)
    return graph_http_url
