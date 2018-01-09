require(['gitbook', 'jquery'], function (gitbook, $) {
  console.log('gitbook-plugin-keyvault initiated');

  gitbook.events.bind('page.change', function (context) {
    $('code.lang-keyvaultsecret').each(function (index, element) {
      var $element = $(element);
      var $pre = $element.parent();
      var code = $element.text().trim();

      var settings = {
        crossDomain: true,
        url: gitbook.page.getState().bookRoot + 'keyvault/secret/' + encodeURIComponent(code),
        method: 'GET'
      };

      $.ajax(settings).done(function (response) {
        //console.log(response);
        $pre.replaceWith(printSecret(response));
      });
    });

    function printSecret(secret) {

      var secretValue = secret.value || (secret.error + ' needs one of ' + secret.tags.roles.replace(/"/g, '\''));

      return `<div class="keyvault">
        <h6>` + secret.name.toUpperCase() + `</h6>
        <div>
          <div class="valuediv">
            <input id="input_` + secret.name + `" class="value" value="` + secretValue + `" />
          </div>
          <div class="actiondiv">
            <a href="" onclick="copyToClipboard('input_` + secret.name + `');"><i class="fa fa-clipboard" aria-hidden="true"></i></a>&nbsp; 
            <a href="#"><i class="fa fa-info-circle" aria-hidden="true"></i></a>
          </div>
        </div>
        <div class="detailsdiv" id="details_` + secret.name + `"><pre>
          ` + JSON.stringify(secret) + `
        </pre></div>
      </div>`;
    }

    $('code.lang-keyvaultnamespace').each(function (index, element) {
      var $element = $(element);
      var $pre = $element.parent();
      var code = $element.text().trim();

      var settings = {
        crossDomain: true,
        url: gitbook.page.getState().bookRoot + 'keyvault/namespace/' + encodeURIComponent(code),
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
  // console.log('copy to clipboard');
}