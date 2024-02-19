const { json } = require("express");

const SERVER_URL = "http://localhost:4000";

test("1+2=3, empty array is empty", () => {
    expect(1 + 2).toBe(3);
    expect([].length).toBe(0);
});

test("/postNote - Post a note", async () => {
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  const postNoteBody = await postNoteRes.json();

  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");
});

test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
  const res1 = await fetch(SERVER_URL + "/deleteAllNotes", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });
  
  expect(res1.status).toBe(200);
  const res2 = await fetch(SERVER_URL + "/getAllNotes", {
    method: "GET",
    headers: "application/json"
  });

  expect(res2.status).toBe(200);
  expect((await res2.json()).length).toBe(0);
});

test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
  const res1 = await fetch(SERVER_URL + "/deleteAllNotes", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    }
  });

  for (let i = 0; i < 2; i++) {
    post = await fetch(SERVER_URL + "/postNote", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "lmao",
        content: "=D"
      })
    });

    expect(post.status).toBe(200);
    expect((await post.json()).response).toBe("Note added succesfully.");
  }
  
  expect(res1.status).toBe(200);
  const res2 = await fetch(SERVER_URL + "/getAllNotes", {
    method: "GET",
    headers: "application/json"
  });

  expect(res2.status).toBe(200);
  expect((await res2.json()).length).toBe(2);
});

test("/deleteNote - Delete a note", async () => {
  const res1 = await fetch(SERVER_URL + "/postNote", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: "NUH UH",
      content: "YUH HUH"
    })
  });

  expect(res1.status).toBe(200);
  const body1 = await res1.json();
  const res2 = await fetch(SERVER_URL + "/deleteNote/" + body1.insertedId, {
    method: "DELETE",
    headers: {
      "Content-Type": 'application/json'
    }
  });

  const body2 = await res2.json();
  expect(res2.status).toBe(200);
  expect(body2.response).toBe("Document with ID " + body2.insertedId + " deleted.");
});

test("/patchNote - Patch with content and title", async () => {
  const res1 = await fetch(SERVER_URL + "/postNote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: ":D",
      content: "D;"
    })
  });

  expect(res1.status).toBe(200);
  const res2 = await fetch(SERVER_URL + "/patchNote/" + (await res1.json()).insertedId, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify({
      title: "t",
      content: "c"
    })
  });

  const body5 = await res2.json();
  expect(res2.status).toBe(200);
  expect(body5.response).toBe('Document with ID ' + body5.insertedId + ' patched.');  
});

test("/patchNote - Patch with just title", async () => {
  const res1 = await fetch(SERVER_URL + "/postNote", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: "jeff",
      content: "bezos"
    })
  });

  expect(res1.status).toBe(200);
  const body1 = await res1.json();

  const res2 = await fetch(SERVER_URL + "/patchNote/" + body1.insertedId, {
    method: 'PATCH',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      title: "lmao"
    })
  });

  const body2 = await res2.json();
  expect(res2.status).toBe(200);
  expect(body2.response).toBe('Document with ID ' + body2.insertedId + ' patched.');
});

test("/patchNote - Patch with just content", async () => {
  const res1 = await fetch(SERVER_URL + "/postNote", {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      title: "YIPPEE",
      content: "Yayy"
    })
  });

  expect(res1.status).toBe(200);
  const body1 = await res1.json();

  const res2 = await fetch(SERVER_URL + "/patchNote/" + body1.insertedId, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      content: "New Content"
    })
  });

  const body2 = await res2.json();

  expect(res2.status).toBe(200);
  expect(body2.response).toBe("Document with ID " + body2.insertedId + " patched.");
});

test("/deleteAllNotes - Delete one note", async () => {
  const res1 = await fetch(SERVER_URL + "/deleteAllNotes", {
    method: 'DELETE',
    headers: "application/json"
  });

  expect(res1.status).toBe(200);

  const res2 = await fetch(SERVER_URL + "/postNote", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: "Huh?",
      content: "Ohhh"
    })
  });

  expect(res2.status).toBe(200);

  const res5 = await fetch(SERVER_URL + "/deleteAllNotes", {
    method: 'DELETE',
    headers: "application/json"
  });

  expect(res5.status).toBe(200);
  expect((await res5.json()).response).toBe("1 note(s) deleted.");
});

test("/deleteAllNotes - Delete three notes", async () => {
  const res1 = await fetch(SERVER_URL + '/deleteAllNotes', {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json"
    }
  });
  expect(res1.status).toBe(200);

  let post;
  for (let j = 0; j < 3; j++) {
    post = await fetch(SERVER_URL + "/postNote", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "lmao",
        content: "=D"
      })
    });

    expect(post.status).toBe(200);
    expect((await post.json()).response).toBe("Note added succesfully.");
  }
  
  const res2 = await fetch(SERVER_URL + '/deleteAllNotes', {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json"
    }
  });

  expect(res2.status).toBe(200);
  expect(res2.response).toBe("3 note(s) deleted.");
});

test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
  const res = await fetch(SERVER_URL + '/postNote', {
    method: 'POST',
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify({
      title: "rahhhhhhhh",
      content: "..."
    })
  });

  expect(res.status).toBe(200);
  const resBody = await res.json();
  expect(resBody.response).toBe("Note added successfully.");

  const res2 = await fetch(SERVER_URL + "/updateNoteColor/" + resBody.insertedId, {
    method: 'PATCH',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      color: '#FF0000'
    })
  });

  expect(res2.status).toBe(200);
  expect((await res2.json()).message).toBe('Note color updated successfully.');
});
