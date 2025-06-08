postgres = import_module("github.com/kurtosis-tech/postgres-package/main.star")

POSTGRES_MIN_CPU = 10
POSTGRES_MAX_CPU = 1000
POSTGRES_MIN_MEMORY = 32
POSTGRES_MAX_MEMORY = 1024

def run(plan, rpc_url, env="main"):

    graph = import_module("github.com/LZeroAnalytics/graph-package@{}/main.star".format(env))

    # Spin up graph node for network
    graph_output = graph.run(plan, rpc_url=rpc_url, env=env)

    plan.print(graph_output.graph)
    plan.print(graph_output.ipfs)

    postgres_output = postgres.run(
        plan,
        service_name="dfns-postgres",
        min_cpu=POSTGRES_MIN_CPU,
        max_cpu=POSTGRES_MAX_CPU,
        min_memory=POSTGRES_MIN_MEMORY,
        max_memory=POSTGRES_MAX_MEMORY,
    )

    postgres_user = postgres_output.user
    postgres_password = postgres_output.password
    postgres_hostname = postgres_output.service.hostname
    postgres_database = postgres_output.database

    plan.print(postgres_user)
    plan.print(postgres_hostname)

