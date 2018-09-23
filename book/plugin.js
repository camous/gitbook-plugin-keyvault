require(['gitbook', 'jquery'], function (gitbook, $) {
  console.log('gitbook-plugin-keyvault initiated');

  gitbook.events.bind('page.change', function () {
    $('code.lang-keyvaultsecret').each(function (index, element) {
      var $element = $(element);
      $element.append('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
      var $pre = $element.parent();
      var code = $element.text().trim();

      var settings = {
        crossDomain: true,
        url: window.location.origin + '/keyvault/secret/' + encodeURIComponent(code),
        method: 'GET'
      };

      $.ajax(settings).done(function (response) {
        // console.log(response);
        $pre.replaceWith(printSecret(response));
      });
    });

    function printSecret(secret) {

      var secretValue = secret.value || (secret.error + ' needs one of ' + secret.tags.roles.replace(/"/g, '\''));
      var detailsSecret = secret;
      delete detailsSecret.value;
      
      return `<div class="keyvault">
        <h6>` + secret.name.toUpperCase() + `</h6>
        <div class="secret">
          <div class="valuediv">
            <input id="input_` + secret.name + `" class="value" value="` + secretValue + `" />
          </div>
          <div class="actiondiv">
            <a href="" onclick="copyToClipboard('input_` + secret.name + `');"><i class="fa fa-clipboard" aria-hidden="true"></i></a>&nbsp; 
            <a href="#" onclick="$('#details_` + secret.name + `').toggle();"><i class="fa fa-info-circle" aria-hidden="true"></i></a>
          </div>
        </div>
        <div class="detailsdiv" id="details_` + secret.name + `"><pre class="keyvaultdetails">
          ` + JSON.stringify(detailsSecret, null, 1) + `
        </pre></div>
      </div>`;
    }

    $('code.lang-keyvaultnamespace').each(function (index, element) {
      var $element = $(element);
      $element.append('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
      var $pre = $element.parent();
      var code = $element.text().trim();

      var settings = {
        crossDomain: true,
        url: window.location.origin + '/keyvault/namespace/' + encodeURIComponent(code),
        method: 'GET'
      };

      $.ajax(settings).done(function (response) {
        // console.log(response);
        var list = '';
        for (var id in response) {
          var secret = response[id];
          list += printSecret(secret);
        }
        $pre.replaceWith(list);
      });
    });
  });
});

function copyToClipboard(input) {
  $('#' + input).focus().select();
  document.execCommand('copy');
}
