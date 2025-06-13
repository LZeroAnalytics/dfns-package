postgres = import_module("github.com/kurtosis-tech/postgres-package/main.star")
indexer_launcher = import_module("./src/indexer/indexer_launcher.star")

POSTGRES_MIN_CPU = 10
POSTGRES_MAX_CPU = 1000
POSTGRES_MIN_MEMORY = 32
POSTGRES_MAX_MEMORY = 1024

def run(plan, rpc_url, chain_id, network_type, coingecko_api, env="main"):

    # Launch indexer
    graph_http_url = indexer_launcher.launch_indexer(plan, rpc_url, env)

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
    postgres_port = postgres_output.port

    # Initialize database schema
    schema_file = plan.upload_files(
        src = "./src/database/schema.sql",
        name = "database-schema"
    )

    plan.run_sh(
        run = "PGPASSWORD={} psql -h {} -U {} -d {} -f /database/schema.sql".format(postgres_password, postgres_hostname, postgres_user, postgres_database),
        name = "schema-initializer",
        image = "postgres:15",
        files = {
            "/database": schema_file
        }
    )

    plan.add_service(
        name = "dfns-api",
        config = ServiceConfig(
            image = "tiljordan/dfns-api:1.0.0",
            ports = {
                "http": PortSpec(
                    number = 3000,
                    transport_protocol = "TCP",
                    application_protocol = "http",
                    wait = None
                )
            },
            env_vars = {
                "{}_RPC_URL".format(network_type.upper()): rpc_url,
                "{}_CHAIN_ID".format(network_type.upper()): chain_id,
                "DATABASE_HOST": postgres_hostname,
                "DATABASE_PORT": str(postgres_port.number),
                "DATABASE_USERNAME": postgres_user,
                "DATABASE_PASSWORD": postgres_password,
                "DATABASE_NAME": "postgres",
                "COINGECKO_API_KEY": coingecko_api,
                "SUBGRAPH_URL": graph_http_url,
                "DFNS_API_URL": "https://api.dfns.io"
            }
        ),
        description = "Adding Dfns API"
    )

