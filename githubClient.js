
const Octokat = require("octokat");


exports.status = function status({
                                   token,
                                   owner,
                                   repo,
                                   sha,
                                   state,
                                   context,
                                   description,
                                   url,
                                   rootURL
                                 }) {
  const octo = new Octokat({ token: token, rootURL: rootURL });
  return octo.repos(owner, repo).statuses(sha).create({
    state: state,
    context: context,
    description: description,
    target_url: url,
  })
};


