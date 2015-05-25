function ajaxRequest(method, url, formid){
      $.ajax({
      type: method,
      contentType: "application/json",
      url: url,
      data: JSON.stringify(getFormData($("#"+formid))),
      dataType: "json"
      })
        .done(function(data) {
          console.log("AJAX SUCCESS" + data);
         })
        .fail(function() {
          console.log("AJAX FAIL");
           alert("AJAX FAIL");
        })
        .always(function(data) {
           $("#status").text("Response: " + data).show();
        });
    }

function getFormData($form){
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};
          $.map(unindexed_array, function(n, i){
           indexed_array[n['name']] = n['value'];
         });
        return indexed_array;
      }
