let reviewFrom = document.querySelector("#reviewForm");
let reviewContainer = document.querySelector(".reviewContainer");
reviewFrom.addEventListener("submit", async function (e) {
  e.preventDefault();
  let formData = new FormData(reviewFrom);
  let data = {
    rating: formData.get("rating"),
    comment: formData.get("comment"),
  };
  const res = await axios.post(window.location.pathname + "/reviews", data);
  let div = document.createElement("div");
  div.className =
    "review_card bg-white w-full col-span-4 p-3 rounded-lg shadow";
  div.innerHTML = `
        <h1>${res.data.rating} Stars</h1>
        <p>${res.data.comment}</p>
        <form method="post" action="${window.location.pathname}/reviews/${res.data._id}?_method=DELETE"><button class="px-2 active:scale-90 py-1 bg-red-500 text-white rounded-lg">Delete</button></form>
      `;
  reviewContainer.append(div);
  reviewFrom.reset();
});
