export const users = [
    {
      id: 1,
      email: "optimix@live.ca",
      password: "123",
      first_name: "John",
      last_name: "Doe",
      location: "Montreal",
      occupation: "Software Engineer",
      birthday: "1990-01-01",
      status: "Hello World",
      auth_level: "user",
    },
    
  ];

  export const Post = [
    {
      id: 1,
      user_id: 1,
      content: "Hello World",
      likes: 0,
      time_stamp: "2023-03-21T14:05:42.406Z",
      comments: [],

    },
  ];

  export const Comments = [
    {
      id: 1,
      post_id: 1,
      user_id: 1,
      content: "Hello World",
      likes: 0,
      time_stamp: "2023-03-21T14:05:42.406Z",
    },
  ];
