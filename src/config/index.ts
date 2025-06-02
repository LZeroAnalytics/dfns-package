import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  dfns: {
    apiUrl: process.env.DFNS_API_URL || 'https://api.dfns.io',
    appId: process.env.DFNS_APP_ID || 'ap-5f357-13d6g-8pirkkji193gu11q',
    orgId: process.env.DFNS_ORG_ID || '6qtkb 4he9b',
    signingKeyId: process.env.DFNS_SIGNING_KEY_ID || 'Y2ktN2FwNjUtMTRpcTItODN1OHFvdmo2djFqNjk4ZQ',
    privateKey: process.env.DFNS_PRIVATE_KEY || `-----BEGIN RSA PRIVATE KEY-----
MIIEoQIBAAKCAQB/UviwPdu+SXNdSG9sL7y8R2swnkMBOM8WZzSNUsAMmKrY+v89
bwgx+EIMgORsnAXCbd8l91mjtjvn8Wb8wLhQt8x0bnjnsuXJkopkMfSYogrESZTg
JANvQOuFxOZusE+Rb7m0Q8vJ0oz0Tzx6A8s2Wj7gs+BuzLzYspeR+Qd2JEtbkI5b
Op+/TJ57neN6yqpCxDMSLlyqXGHnYFMGAmrjsHjkJb/wNYlQVEw8RZ2DfQzlrdem
PvynFcGT7Sfqz4XnbzsqvQ5Zv9UlM0QQ8P71I9ZaTWsFBQw+m4h8XFcyzmehrpyz
jmNQT5cRh8oEBQOnJO2rmzEfN0JQTlIJ7M7zAgMBAAECggEARcniyid91PVJqK3V
dQVNfB3hYQq+S2MqD2uOYJAk+EKOEtSxJqk/YrRi75uOmQGEHqg+kf7cQWHXwDCP
dKbl4Eh+ZqtO1iE21p/d/0Fqgmb/Y8u5MIpM36RD9FSSwcUeN+d3cJlgkEU6QYdU
7MQ7lJUutdeigtjyAg0SC07mihhfjT6xx/llMK+tx9a6omqT3YZ0TDZN0PosXrXD
tyAtbzBfC65oSaGcy+yoQmlfLvnWsiiyMtVeXBRjDsiVBFS/GQ/SiC79yd36oEN1
LA0Q7dGltmzDn1M0GFGSgRDFwV84BcIngl3AvvetzpaGFAFP04qj3S40Yn8CY44X
J+gcgQKBgQDKMt1QuvI90oYcXOsJlbb13Ai7DBKZyH6GsX2i5c0BmuhwvW40WGc1
qcEFOxFN/UT/l9hsAtQxGFCouvx2ekhAhPYe5LBmyBVtMEAaSlQqDhjcsrZjhkvS
qDUOuBA7T1kEoKN0kLFocdQx5Aj1nY1cblDVN9d/9AqlMkkmoICZkwKBgQChM+MY
aA9j63U7119aZIUDzfrA/riWhHr5EH+nhlyEjhTTbbrWhXLcjhelBloywlEnbhQa
Yn9TSz9lFDUJxhdqr7fl9Ht4/3zK6hahAa0AfxdDxTC0tlycxzvaXqnfz4aYNDYB
v7WpdubUYOdtsEnfmecvRc/aYjW3FRgmTyjRIQKBgFxenjIKJS3O5ctBO3I2fc2V
RjvEyR6NtBduL/nhxySLktImB5lMJWIjeXUdRct9/y5QPOMi67K96+MZAMpTFHy9
AP6d9GQP1ZH6793SxN4tcHgqAB45NJw4kXx245tkpULy65kNnK4dChX8mYczAWgP
UUgGaaEfaFmNPlOyEO2XAoGAI0wHN7rhU9Gks9uux04nSfP6KfQcWujbPFn+eaIT
8/pgWQM32+0Qf3aler7vVRnzRxz1TemvU3+we+N20ZMMYZHkRHfJ6W6X1p53If4J
8YfigjZVOdyMXs/JLUF5FMaOBBm6kZt2nYqpdGtbgUsOgeVjF5jDsF+8vz/hL9I5
b8ECgYATvYkUn+tSnD2Cpcla7kKb7wuxMVrz8Qbzkq3gQgmkjvaNREW44YvxVCUc
mRgo/2WH89a/cNVyFC0oUvZxcAJ5rEt4LpifFYJYU0//aObHstYFDsA89FXEVOGy
5OUpVSQCt4AR7UJab3O2HmEtsn++OEJOtpCc1SKdUkiJiRvxCA==
-----END RSA PRIVATE KEY-----`,
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
};
