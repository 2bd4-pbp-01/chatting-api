## API Documentation

------------------------------------------------------------------------------------------

#### Group

<details>
 <summary><code>POST</code> <code><b>/</b></code> <code>(Create Group)</code></summary>

##### Parameters

> | name      | type     | data type | description                     |
> |-----------|----------|-----------|---------------------------------|
> | groupId   | required | string    | Unique identifier for the group |
> | groupName | required | string    | Name of the group               |

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

#### Description
Endpoint ini digunakan untuk membuat grup baru. Setiap grup memiliki `groupId` yang unik dan `groupName` yang merupakan nama dari grup tersebut.

</details>

<details>
 <summary><code>GET</code> <code><b>/</b></code> <code>(Get All Groups)</code></summary>

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

</details>

------------------------------------------------------------------------------------------

#### Message

<details>
 <summary><code>POST</code> <code><b>/:groupId</b></code> <code>(Send Message)</code></summary>

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

</details>

<details>
 <summary><code>GET</code> <code><b>/:groupId</b></code> <code>(Get Messages)</code></summary>

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

</details>

<details>
 <summary><code>GET</code> <code><b>/</b></code> <code>(Get All Groups and Messages)</code></summary>

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

</details>
<details>
 <summary><code>GET</code> <code><b>/messages/listen/:groupId</b></code></summary>

### Parameters

> | name      | type     | data type | description                                 |
> |-----------|----------|-----------|---------------------------------------------|
> | groupId   | required | string    | The ID of the group to listen for messages. |

### Request

> | name | type | data type | description |
> |------|------|-----------|-------------|
> | None | N/A  | N/A       | N/A         |

### Responses

> | http code | content-type        | response                                                                           |
> |-----------|---------------------|------------------------------------------------------------------------------------|
> | `200`     | `text/event-stream` | data: {"senderId":"senderId","text":"message from user","timestamp":1730654835242} |
> | `500`     | `application/json`  | `{"error":"Internal Server Error"}`                                                |

### Description
Endpint ini digunakan untuk mendengarkan pesan yang masuk ke dalam grup secara Realtime. Pesan yang masuk akan dikirimkan dalam format `text/event-stream` dengan format `data: message\n\n`. Pesan yang dikirimkan adalah pesan yang masuk setelah koneksi berhasil dibuat.

</details>