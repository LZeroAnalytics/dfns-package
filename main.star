postgres = import_module("github.com/kurtosis-tech/postgres-package/main.star")
indexer_launcher = import_module("./src/indexer/indexer_launcher.star")

POSTGRES_MIN_CPU = 10
POSTGRES_MAX_CPU = 1000
POSTGRES_MIN_MEMORY = 32
POSTGRES_MAX_MEMORY = 1024

def run(plan, rpc_url, env="main"):

    # Launch indexer
    indexer_launcher.launch_indexer(plan, rpc_url, env)

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

