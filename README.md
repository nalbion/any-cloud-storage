# any-cloud-storage

`any-cloud-storage` provides a common interface for file storage across multiple cloud providers including [AWS S3](https://aws.amazon.com/s3/), [GCP](https://cloud.google.com/storage), [Firebase](https://firebase.google.com/docs/storage/), [Supabase](https://supabase.com/storage), `git` and local file-system storage.

## Interface

The library provides the `FileStorage` interface with the following methods:

- `saveFile(filePath, data: Buffer, { encoding: 'utf-8', contentType: 'text/plain' })`
- `saveTextFile(filePath, data: string)`
- `readFile(filePath) => Promise<Buffer>`
- `readTextFile(filePath) => Promise<string>`
- `deleteFile(filePath)`
- `listFiles(directoryPath) => Promise<string[]>`

## Configuration

Each implementation can be configured using a nested map of `string` | `number` | `boolean` | `array` so that the configuration can be saved in a JSON/YAML file.

### Examples:

- `{ type: 'file', basePath }`
- `{ type: 'firebase', bucketUrl: 'gs://my-custom-bucket' }`
- `{ type: 'gcp', bucketName, apiEndpoint? }`
- `{ type: 'git', repoUrl, username, options?: { baseDir?, binary?, config? } }`
- `{ type: 's3', bucket }`
- `{ type: 'supabase', url, key, bucket }`

## Usage

Import `createStorage` and call it with your `config` to create a storage instance.

```typescript
import createStorage from "any-cloud-storage";

const config = { type: "file", basePath: "/tmp" };
// const config = {
//   type: 's3',
//   bucket: 'my-bucket',
//   region: 'us-west-2',
//   // other AWS S3 configuration options...
// };

const storage = createStorage(config);
```

Alternatively, you directly import the implementation you want to use:

```typescript
import LocalFileStorage from "any-cloud-storage/implementations/LocalFileStorage";

const storage = new LocalFileStorage("/tmp");
```

Now you can use the `storage` instance to read/write files:

```typescript
const filePath = "path/to/my/file.txt";
const text = "Hello, world!";

// Save a file
await storage.saveTextFile(filePath, text);
// or await storage.saveFile(filePath, Buffer.from(text, 'utf-8'));

// Read a file
const readDate = await storage.readTextFile(filePath);
// or const readData = (await storage.readFile(filePath)).toString('utf-8');
console.log(readData); // 'Hello, world!'

// List files
const files = await storage.listFiles("path/to/my");
console.log(files); // ['file.txt']

// Delete a file
await storage.deleteFile(filePath);
```

## Implementations

The library includes implementations for the following cloud providers:

- Firebase (`FirebaseClientStorage`)
- Google Cloud Platform (`GcpStorage`)
- Git (`GitStorage`)
- Local file system (`LocalFileStorage`)
- AWS (`S3FileStorage`)
- Supabase (`SupabaseStorage`)
