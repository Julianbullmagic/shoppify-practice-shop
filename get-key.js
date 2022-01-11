const axios = require('axios')
axios.post('https://shoeshoeshoe3218.myshopify.com/admin/api/2021-10/storefront_access_tokens.json', {})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
axios.get('https://shoeshoeshoe3218.myshopify.com/admin/api/2021-10/storefront_access_tokens.json', {})
 .then(function (response) {
   console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

