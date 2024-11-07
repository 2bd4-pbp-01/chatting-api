## API Documentation

------------------------------------------------------------------------------------------

#### Group

<details>
 <summary><code>POST</code> <code><b>/groups</b></code> <code>(Create Group)</code></summary>

#### Description
Endpoint ini digunakan untuk membuat grup baru. Setiap grup memiliki `groupId` yang unik dan `groupName` yang merupakan nama dari grup tersebut.


##### Parameters

> | name    | type     | data type | description |
> |---------|----------|-----------|-------------|
> | None    | N/A      | N/A       | N/A         |

##### Request

> | name      | type     | data type | description                     |
> |-----------|----------|-----------|---------------------------------|
> | groupId   | required | string    | Unique identifier for the group |
> | groupName | required | string    | Name of the group               |


##### Responses

> | http code | content-type       | response                                        |
> |-----------|--------------------|-------------------------------------------------|
> | `201`     | `application/json` | `{"message":"Group Berhasil Dibuat"}`           |
> | `500`     | `application/json` | `{"error":"Error message detailing the issue"}` |


##### Example cURL
```bash
curl -X POST http://localhost:3000/groups -d '{"groupId":"1","groupName":"Group 1"}' -H "Content-Type: application/json"
```

</details>

<details>
 <summary><code>GET</code> <code><b>/groups</b></code> <code>(Get All Groups)</code></summary>

#### Description
Endpoint ini digunakan untuk mendapatkan semua grup yang ada.

##### Parameters

> | name    | type     | data type | description |
> |---------|----------|-----------|-------------|
> | None    | N/A      | N/A       | N/A         |

##### Request

> | name | type | data type | description |
> |------|------|-----------|-------------|
> | None | N/A  | N/A       | N/A         |

##### Responses

> | http code | content-type       | response                                                         |
> |-----------|--------------------|------------------------------------------------------------------|
> | `200`     | `application/json` | `{"groupId":"1","groupName":"Group 1", "createdAt":"timestamp"}` |
> | `500`     | `application/json` | `{"error":"Error message detailing the issue"}`                  |

##### Example cURL
```bash
curl -X GET http://localhost:3000/groups
```

</details>

------------------------------------------------------------------------------------------

#### Message

<details>
 <summary><code>POST</code> <code><b>/messages/:groupId</b></code> <code>(Send Message)</code></summary>

##### Description
Endpoint ini digunakan untuk mengirimkan pesan ke dalam grup. Setiap pesan memiliki `senderId` yang merupakan identitas pengirim pesan dan `text` yang merupakan isi dari pesan tersebut.


##### Parameters

> | name     | type     | data type | description                      |
> |----------|----------|-----------|----------------------------------|
> | groupId  | required | string    | Unique identifier for the group  |

##### Request

> | name      | type     | data type | description                       |
> |-----------|----------|-----------|-----------------------------------|
> | senderId  | required | string    | Unique identifier for the sender  |
> | text      | required | string    | Content of the message            |

##### Responses

> | http code | content-type       | response                                        |
> |-----------|--------------------|-------------------------------------------------|
> | `201`     | `application/json` | `{"message":"Message berhasil ditambahkan"}`    |
> | `500`     | `application/json` | `{"error":"Error message detailing the issue"}` |

##### Example cURL
```bash
curl -X POST http://localhost:3000/messages/1 -d '{"senderId":"user1","text":"Hello"}' -H "Content-Type: application/json"
```


</details>

<details>
 <summary><code>GET</code> <code><b>/messages/:groupId</b></code> <code>(Get Messages)</code></summary>

###### Description
Endpoint ini digunakan untuk mendapatkan semua pesan yang ada di dalam grup.


##### Parameters

> | name     | type     | data type             | description                       |
> |----------|----------|-----------------------|-----------------------------------|
> | groupId  | required | string                | Unique identifier for the group   |

##### Request

> | name     | type     | data type | description                       |
> |----------|----------|-----------|-----------------------------------|
> | None     | N/A      | N/A       | N/A                               |

##### Responses

> | http code | content-type       | response                                                                    |
> |-----------|--------------------|-----------------------------------------------------------------------------|
> | `200`     | `application/json` | `[{"id":"msg1","senderId":"user1","text":"Hello","timestamp":"timestamp"}]` |
> | `500`     | `application/json` | `{"error":"Error message detailing the issue"}`                             |

##### Example cURL
```bash
curl -X GET http://localhost:3000/messages/dev123
```

</details>

<details>
 <summary><code>GET</code> <code><b>/messages</b></code> <code>(Get All Groups and Messages)</code></summary>

##### Description
Endpoint ini digunakan untuk mendapatkan semua grup beserta pesan yang ada di dalamnya.

##### Parameters

> | name | type | data type | description |
> |------|------|-----------|-------------|
> | None | N/A  | N/A       | N/A         |

##### Request

> | name | type | data type | description |
> |------|------|-----------|-------------|
> | None | N/A  | N/A       | N/A         |

##### Responses

> | http code | content-type       | response                                                                                                                                               |
> |-----------|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
> | `200`     | `application/json` | `[{"groupId":"1","groupName":"Group 1","createdAt":"timestamp","messages":[{"id":"msg1","senderId":"user1","text":"Hello","timestamp":"timestamp"}]}]` |
> | `404`     | `application/json` | `{"error":"Tidak ada grup yang ditemukan"}`                                                                                                            |
> | `500`     | `application/json` | `{"error":"Error message detailing the issue"}`                                                                                                        |

##### Example cURL
```bash
curl -X GET http://localhost:3000/messages
```

</details>
<details>
 <summary><code>GET</code> <code><b>/messages/listen/:groupId</b></code></summary>

##### Description
Endpint ini digunakan untuk mendengarkan pesan yang masuk ke dalam grup secara Realtime. Pesan yang masuk akan dikirimkan dalam format `text/event-stream` dengan format `data: message\n\n`. Pesan yang dikirimkan adalah pesan yang masuk setelah koneksi berhasil dibuat.


##### Parameters

> | name      | type     | data type | description                                 |
> |-----------|----------|-----------|---------------------------------------------|
> | groupId   | required | string    | The ID of the group to listen for messages. |

##### Request

> | name | type | data type | description |
> |------|------|-----------|-------------|
> | None | N/A  | N/A       | N/A         |

##### Responses

> | http code | content-type        | response                                                                           |
> |-----------|---------------------|------------------------------------------------------------------------------------|
> | `200`     | `text/event-stream` | data: {"senderId":"senderId","text":"message from user","timestamp":1730654835242} |
> | `500`     | `application/json`  | `{"error":"Internal Server Error"}`                                                |

##### Example cURL
```bash
curl -X GET http://localhost:3000/messages/listen/dev123
```

</details>
