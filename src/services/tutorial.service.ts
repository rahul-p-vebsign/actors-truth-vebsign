import { ResultSetHeader, RowDataPacket } from "mysql2";
import connection from "../db";
import Tutorial from "../models/tutorial.model";

interface ITutorialRepository {
  save(tutorial: Tutorial): Promise<Tutorial>;
  retrieveAll(searchParams: { title?: string; published?: boolean }): Promise<Tutorial[]>;
  retrieveById(tutorialId: number): Promise<Tutorial | undefined>;
  update(tutorial: Tutorial): Promise<number>;
  delete(tutorialId: number): Promise<number>;
  deleteAll(): Promise<number>;
}

class TutorialRepository implements ITutorialRepository {
  async save(tutorial: Tutorial): Promise<Tutorial> {
    try {
      const query = "INSERT INTO tutorials (title, description, published) VALUES (?, ?, ?)";
      const params = [tutorial.title, tutorial.description, tutorial.published ?? false];
      const [res] = await connection.promise().query<ResultSetHeader>(query, params);            
      if (res.affectedRows === 0) {
        throw new Error("Data was not saved.");
      }else{
        const savedTutorial = await this.retrieveById(res.insertId);
        if (!savedTutorial) throw new Error("Tutorial not found after save.");      
        return savedTutorial;
      }      
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  

/*
To call the `retrieveAll` function with different parameters, you can pass an object with the desired properties. Here are a few examples:

1. **Retrieving all tutorials without any search parameters:**

```javascript
const tutorials = await retrieveAll({});
```

2. **Retrieving tutorials with a specific title:**

```javascript
const tutorials = await retrieveAll({ title: "JavaScript" });
```

3. **Retrieving tutorials with a specific published status:**

```javascript
const tutorials = await retrieveAll({ published: true });
```

4. **Retrieving tutorials with both a specific title and published status:**

```javascript
const tutorials = await retrieveAll({ title: "JavaScript", published: true });
```

In each case, you create an object with the properties `title` and/or `published` and pass it to the `retrieveAll` function. 
The function will handle the parameters accordingly.

*/

  async retrieveAll(searchParams: { title?: string; published?: boolean }): Promise<Tutorial[]> {
    let query: string = "SELECT * FROM tutorials";
    let conditions: string[] = [];

    if (searchParams.published !== undefined) {
      conditions.push(`published = ${searchParams.published ? 'TRUE' : 'FALSE'}`);
    }

    if (searchParams.title) {
      conditions.push(`LOWER(title) LIKE '%${searchParams.title.toLowerCase()}%'`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    try {
      const [rows] = await connection.promise().query<RowDataPacket[]>(query);
      const tutorials: Tutorial[] = rows.map(row => {
        return {
          id: row.id,
          title: row.title,
          description: row.description,
          published: row.published
        } as Tutorial;
      });
      return tutorials;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async retrieveById(tutorialId: number): Promise<Tutorial | undefined> {
    try {
      const query = "SELECT * FROM tutorials WHERE id = ?";
      const params = [tutorialId];
      const [rows] = await connection.promise().query<RowDataPacket[]>(query, params);
  
      if (!rows.length) return undefined;      
      const row = rows[0];

      return {
        id: row.id,
        title: row.title,
        description: row.description,
        published: row.published
      } as Tutorial;

    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(tutorial: Tutorial): Promise<number> {
  try {
    const query = "UPDATE tutorials SET title = ?, description = ?, published = ? WHERE id = ?";
    const params = [tutorial.title, tutorial.description, tutorial.published, tutorial.id];
    const [res] = await connection.promise().query<ResultSetHeader>(query, params);
    return res.affectedRows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}


async delete(tutorialId: number): Promise<number> {
  try {
    const query = "DELETE FROM tutorials WHERE id = ?";
    const params = [tutorialId];
    const [res] = await connection.promise().query<ResultSetHeader>(query, params);
    return res.affectedRows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async deleteAll(): Promise<number> {
  try {
    const query = "DELETE FROM tutorials";
    const [res] = await connection.promise().query<ResultSetHeader>(query);
    return res.affectedRows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

}

export default new TutorialRepository();
