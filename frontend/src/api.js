export const getComments = async (id) => {
  const response = await fetch("http://localhost:5000/shop/book/comments/" + id)
  const data = await response.json();
  console.log(data.messages);
  return data.messages;
};

export const createComment = async (text, parentId = null) => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    body: text,
    parentId,
    userId: "1",
    username: "John",
    createdAt: new Date().toISOString(),
  };
};

export const updateComment = async (text) => {
  return { text };
};

export const deleteComment = async () => {
  return {};
};
