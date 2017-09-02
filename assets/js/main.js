var EDGE_CONTRIBUTORS = '/stats/contributors',
  EDGE_LANGUAGES = '/languages',
  TOKEN = '0fd2b5dcefa201400f4376d0c7aa86d72f3ac5c8';

jQuery.fn.extend({
  //Used to load featured team members in index.html
  loadtopteam: function() {
    var $container = $(this);

    $.getJSON("/assets/data/team.json", function(json) {
      $.each(json.members, function(index, val) {
        if (val.senior) {
          var sociallinks = "";
          wSocial = 100 / Object.keys(val.social).length;
          $.each(val.social, function(key, val) {

            sociallinks += '<a class="fa ' + json.social_links[key].fa_icon + '" style="width:' + wSocial + '%" href="' + json.social_links[key].prefix + val + '"></a>';
          });
          console.log(sociallinks);
          $card = $('<div class="col-lg-4 col-md-6 col-12">' +
            '<div class="card medium hoverable team_card">' +
            '<div class="card-content center-align">' +
            '<img class="circle responsive-img" src="' + val.image_url + '"></img>' +
            '<h5>' + val.name + '</h5>' +
            '<p>' + val.description + '</p>' +
            '</div>' +
            '<div class="card-action">' +
            sociallinks +
            '</div>' +
            '</div>');
          console.log($card);
          $container.append($card);
        }
      });
    });
  },
  //Used to load projects 
  loadprojects: function(loadAll) {
    var $container = $(this);
    $.ajax({
      url: 'https://hackesta.pythonanywhere.com/github/orgs/codeclubtbms/repos',
      crossDomain: true,
      dataType: 'json',
      success: function(myData) {
        $.each(myData, function(index, repository) {
          if (index <= 9 || loadAll) {
            var contributors, contrib_images = '';
            getContributors(repository.url + EDGE_CONTRIBUTORS, function(contributors) {
              console.log(contributors);
              $.each(contributors, function(index, contributor) {
                if (index < 3) {
                  contrib_images += '<a href="' +contributor.author.html_url + '" target="_blank"><div class="contributor chip"><img class="contrib-img" src="' + contributor.author.avatar_url + '"></img>' + contributor.author.login + '</div></a>';
              //  contrib_images += '<div onclick="contrib_modal(\''+repository.name+'\',\''+ contributor.author.login + '\',\'' + contributor.author.avatar_url +'\')" class="contributor chip"><img class="contrib-img" src="' + contributor.author.avatar_url + '"></img>' + contributor.author.login + '</div>';

                }
              });

              $card = $(
                '<div class="col-lg-4 col-md-6 col-sm-6 col-12">' +
                '<div class="card small hoverable project_card valign-wrapper">' +
                '<div class="card-content center-align">' +
                '<h5 class="activator">' + repository.name + '</h5>' +
                '<p style="margin-bottom: 10px;">' + ((repository.description === null) ? "" : repository.description) + '</p>' +
                contrib_images +
                '<div class="card-action row">' +
                '<a href="' + repository.html_url + '" target="_blank" class="col"><i class="fa fa-github"></i></a>' +
                ((repository.homepage === null || repository.homepage === "") ? "" : '<a href="' + repository.homepage + '" target="_blank" class="col"><i class="fa fa-globe"></i></a>') +
                 '<a class="col-1 activator"><i class="fa fa-ellipsis-v" style="margin-left: 0;"></i></a>'+
                '</div>' +

                '</div>' +
                '<div class="card-reveal">' +
                ' <span class="card-title grey-text text-darken-4">' + repository.name + '<i class="material-icons right">close</i></span>' +
                '<span class="valign-wrapper"><i class="material-icons" style="margin-right: 5px;">update</i> Updated At: ' + (new Date(repository.updated_at)).toLocaleString() + '</span>' +
                '</div>' +
                '</div>' +
                '</div>');

              $container.append($card);
            });

          }
        });
      }
    });
  },
  loadallteam: function() {
    $container = this;
    $.getJSON("/assets/data/team.json", function(json) {
      $.each(json.members, function(index, val) {
        var sociallinks = "";
        $.each(val.social, function(key, val) {

          sociallinks += '<a class="fa ' + json.social_links[key].fa_icon + '" href="' + json.social_links[key].prefix + val + '"></a>';
        });
        console.log(sociallinks);
        $tr = $('<tr><td>' + val.name + '</td><td>' + val.joined_year + '</td><td>' + val.roles + '</td><td>' + sociallinks + '</td></tr>');
        $container.append($tr);
      });
    });
  }
});

function getContributors(url, success) {
  $.ajax({
    url: url.replace("api.github.com", "hackesta.pythonanywhere.com/github"),
    type: 'GET',
    crossDomain: true,
    dataType: 'json',
    success: function(myData) {
      success(myData);

    }
  });
}

function getStats(weeks) {
  additions = 0;
  deletions = 0;
  $.each(weeks, function(index, week) {
    additions += week.a;
    deletions += week.d;
  });
  return '<span style="color: #76ff03;">' + additions + '++</span>/' + '<span style="color: #f44336;">' + deletions + '--</span>';
}

function contrib_modal(project_name, contrib_name, contrib_img){
  console.log(project_name, contrib_name);
  $("#project_name").html(project_name);
  $("#contrib_name").html(contrib_name);
  $("#contrib_img").attr('src', contrib_img);
  $("#modal_contributor").modal("open");
}
