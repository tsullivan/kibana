# @kbn/apm-synthtrace

`@kbn/apm-synthtrace` is a tool in technical preview to generate synthetic APM data. It is intended to be used for development and testing of the Elastic APM app in Kibana.

At a high-level, the module works by modeling APM events/metricsets with [a fluent API](https://en.wikipedia.org/wiki/Fluent_interface). The models can then be serialized and converted to Elasticsearch documents. In the future we might support APM Server as an output as well.

## Usage

This section assumes that you've installed Kibana's dependencies by running `yarn kbn bootstrap` in the repository's root folder.

This library can currently be used in two ways:

- Imported as a Node.js module, for instance to be used in Kibana's functional test suite.
- With a command line interface, to index data based on a specified scenario.

### Using the Node.js module

#### Concepts

- `Service`: a logical grouping for a monitored service. A `Service` object contains fields like `service.name`, `service.environment` and `agent.name`.
- `Instance`: a single instance of a monitored service. E.g., the workload for a monitored service might be spread across multiple containers. An `Instance` object contains fields like `service.node.name` and `container.id`.
- `Timerange`: an object that will return an array of timestamps based on an interval and a rate. These timestamps can be used to generate events/metricsets.
- `Transaction`, `Span`, `APMError` and `Metricset`: events/metricsets that occur on an instance. For more background, see the [explanation of the APM data model](https://www.elastic.co/guide/en/apm/get-started/7.15/apm-data-model.html)
- `Log`: An instance of Log generating Service which supports additional helpers to customise fields like `messages`, `logLevel`
- `SyntheticsMonitor`: An instance of Synthetic monitor. For more information see [Synthetic monitoring](https://www.elastic.co/guide/en/observability/current/monitor-uptime-synthetics.html).

#### Example

```ts
import { service, timerange, toElasticsearchOutput } from '@kbn/apm-synthtrace';

const instance = service({ name: 'synth-go', environment: 'production', agentName: 'go' }).instance(
  'instance-a'
);

const from = new Date('2021-01-01T12:00:00.000Z').getTime();
const to = new Date('2021-01-01T12:00:00.000Z').getTime();

const traceEvents = timerange(from, to)
  .interval('1m')
  .rate(10)
  .flatMap((timestamp) =>
    instance
      .transaction({ transactionName: 'GET /api/product/list' })
      .timestamp(timestamp)
      .duration(1000)
      .success()
      .children(
        instance
          .span('GET apm-*/_search', 'db', 'elasticsearch')
          .timestamp(timestamp + 50)
          .duration(900)
          .destination('elasticsearch')
          .success()
      )
      .serialize()
  );

const metricsets = timerange(from, to)
  .interval('30s')
  .rate(1)
  .flatMap((timestamp) =>
    instance
      .appMetrics({
        'system.memory.actual.free': 800,
        'system.memory.total': 1000,
        'system.cpu.total.norm.pct': 0.6,
        'system.process.cpu.total.norm.pct': 0.7,
      })
      .timestamp(timestamp)
      .serialize()
  );

const esEvents = toElasticsearchOutput(traceEvents.concat(metricsets));
```

#### Generating metricsets

`@kbn/apm-synthtrace` can also automatically generate transaction metrics, span destination metrics and transaction breakdown metrics based on the generated trace events. If we expand on the previous example:

```ts
import {
  getTransactionMetrics,
  getSpanDestinationMetrics,
  getBreakdownMetrics,
} from '@kbn/apm-synthtrace';

const esEvents = toElasticsearchOutput([
  ...traceEvents,
  ...getTransactionMetrics(traceEvents),
  ...getSpanDestinationMetrics(traceEvents),
  ...getBreakdownMetrics(traceEvents),
]);
```

### CLI

Via the CLI, you can run scenarios, either using a fixed time range or continuously generating data. Scenarios are available in [`src/platform/packages/shared/kbn-apm-synthtrace/src/scenarios/`](https://github.com/elastic/kibana/blob/main/src/platform/packages/shared/kbn-apm-synthtrace/src/scenarios/).

For live data ingestion:

```sh
node scripts/synthtrace simple_trace.ts --target=http://admin:changeme@localhost:9200 --live
```

For a fixed time window:

```sh
node scripts/synthtrace simple_trace.ts --target=http://admin:changeme@localhost:9200 --from=now-24h --to=now
```

The script will try to automatically find bootstrapped APM indices. **If these indices do not exist, the script will exit with an error. It will not bootstrap the indices itself.**

#### Local Development

When running the CLI locally, you can simply use the following command to ingest data to a locally running Elasticsearch and Kibana instance:

```sh
node scripts/synthtrace simple_trace.ts
```
_Assuming both Elasticsearch and Kibana are running on the default localhost ports with default credentials._

#### A note when Kibana URL differs from Elasticsearch URL

If the Kibana URL differs from the Elasticsearch URL in protocol or hostname, you should explicitly pass the `--kibana` option to the CLI along with `--target`.

For example when running ES (with ssl) and Kibana (without ssl) locally in Serverless mode, it's recommended to provide both `--target` and `--kibana` options as the auto-discovered Kibana URL might not be correct in this case.
Also use `localhost` instead of `127.0.0.1` as the hostname as `127.0.0.1` will likely not work with self-signed certificates.  

```sh
node scripts/synthtrace simple_trace.ts --target=https://elastic_serverless:changeme@localhost:9200 --kibana=http://elastic_serverless:changeme@localhost:5601
```

#### Using CLI for Elastic Cloud URLs

If you are ingesting data to Elastic Cloud, you can pass the `--target` option with the Elastic Cloud URL. The CLI will infer the Kibana URL from the Elasticsearch URL. 
Or you can pass only `--kibana` and the CLI will infer the Elasticsearch URL from the Kibana URL. Or pass both if URLs are not in default scheme.

```sh
node scripts/synthtrace simple_trace.ts --target=https://<username>:<password>@your-cloud-cluster.kb.us-west2.gcp.elastic-cloud.com/
```

### Understanding Scenario Files

Scenario files accept 3 arguments, 2 of them optional and 1 mandatory

| Arguments   | Type      | Description                                                                                                                                          |
|-------------|:----------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `generate`  | mandatory | This is the main function responsible for returning the events which will be indexed                                                                 |
| `bootstrap`  | optional  | In case some setup needs to be done, before the data is generated, this function provides access to all available ES Clients to play with            |
| `teardown` | optional  | In case some setup needs to be done, after all data is generated, this function provides access to all available ES Clients to play with |

The following options are supported:

### Connection options

| Option              | Type     | Default | Description                                                                                |
|---------------------|----------|:--------|--------------------------------------------------------------------------------------------|
| `--target`          | [string] |         | Elasticsearch target                                                                       |
| `--kibana`          | [string] |         | Kibana target, used to bootstrap datastreams/mappings/templates/settings                   |
| `--versionOverride` | [string] |         | String to be used for `observer.version`. Defauls to the version of the installed package. |

Note:

- If `--target` is not set, Synthtrace will try to detect a locally running Elasticsearch and Kibana.
- For Elastic Cloud urls, `--target` will be used to infer the location of the Cloud instance of Kibana.
- The latest version of the APM integration will automatically be installed and used for `observer.version` when ingesting APM data. In some cases,
  you'll want to use `--versionOverride` to set `observer.version` explicitly.

### Scenario options

| Option           | Type      | Default | Description                          |
|------------------|-----------|:--------|--------------------------------------|
| `--from`         | [date]    | `now()` | The start of the time window         |
| `--to`           | [date]    |         | The end of the time window           |
| `--live`         | [boolean] |         | Generate and index data continuously |
| `--scenarioOpts` |           |         | Raw options specific to the scenario |
Note:

- The default `--to` is `15m`.
- You can combine `--from` and `--to` with `--live` to back-fill some data.
- To specify `--scenarioOpts` you need to use [yargs Objects syntax](https://github.com/yargs/yargs/blob/HEAD/docs/tricks.md#objects). (e.g. --scenarioOpts.myOption=myValue)

### Setup options

| Option       | Type      | Default | Description                                                             |
|--------------|-----------|:--------|-------------------------------------------------------------------------|
| `--clean`    | [boolean] | `false` | Clean APM data before indexing new data                                 |
| `--workers`  | [number]  |         | Amount of Node.js worker threads                                        |
| `--logLevel` | [enum]    | `info`  | Log level                                                               |
| `--type`     | [string]  | `apm`   | Type of data to be generated, `log` must be passed when generating logs |

## Testing

Run the Jest tests:

```
node scripts/jest --config ./src/platform/packages/shared/kbn-apm-synthtrace/jest.config.js
```

## Typescript

Run the type checker:

```
node scripts/type_check.js --project src/platform/packages/shared/kbn-apm-synthtrace/tsconfig.json
```
