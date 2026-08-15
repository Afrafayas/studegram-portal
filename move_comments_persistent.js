import fs from 'fs';

let content = fs.readFileSync('src/components/ApplicationDetailsModal.jsx', 'utf8');

const oldCommentsBlock = `                    {/* Application-Level Comments Section */}
                    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4.5 space-y-3 mt-4 text-left shadow-xs">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-[#D99A1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          COMMENTS ({appComments.length + (application.notes ? 1 : 0)})
                        </h4>
                      </div>

                      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                        {application.notes && (
                          <div className="bg-white border border-amber-200/60 rounded-xl p-3 space-y-1 shadow-3xs">
                            <div className="flex items-center justify-between text-[9px] font-extrabold">
                              <span className="bg-amber-100/70 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200/80">Initial Application Cover Note</span>
                              <span className="text-slate-400">Created on submission</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-800 whitespace-pre-wrap leading-relaxed">
                              {application.notes}
                            </p>
                          </div>
                        )}

                        {appComments.map((comment, cIdx) => (
                          <div key={cIdx} className="bg-white border border-slate-200/80 rounded-xl p-3 space-y-1 shadow-3xs">
                            <div className="flex items-center justify-between text-[9px] font-extrabold">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">{comment.author || 'Agent'}</span>
                              <span className="text-slate-400">{comment.createdAt ? new Date(comment.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-800 whitespace-pre-wrap leading-relaxed">
                              {comment.text}
                            </p>
                          </div>
                        ))}

                        {!application.notes && appComments.length === 0 && (
                          <p className="text-[11px] font-semibold text-slate-400 text-center py-2">No comments added yet for this application.</p>
                        )}
                      </div>

                      {/* Add Comment Input Form */}
                      <form onSubmit={handleAddAppComment} className="flex gap-2 pt-1 border-t border-slate-200/60">
                        <input
                          type="text"
                          value={newAppComment}
                          onChange={(e) => setNewAppComment(e.target.value)}
                          placeholder="Type a new comment for this application..."
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D99A1C]"
                        />
                        <button
                          type="submit"
                          disabled={isPostingAppComment || !newAppComment.trim()}
                          className="bg-[#D99A1C] hover:bg-[#C28410] disabled:opacity-50 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                          {isPostingAppComment ? 'Posting...' : 'Post Comment'}
                        </button>
                      </form>
                    </div>`;

// 1. Remove oldCommentsBlock from inside documents tab
if (content.includes(oldCommentsBlock)) {
  content = content.replace(oldCommentsBlock, '');
}

// 2. Place comments block after activeTab === 'documents' block closes so it is visible in both profile and documents sub-tabs
const documentsEnd = `                    </div>
                  </div>
                )}`;

const newPersistentLayout = `                    </div>
                  </div>
                )}

${oldCommentsBlock}`;

if (content.includes(documentsEnd)) {
  content = content.replace(documentsEnd, newPersistentLayout);
  fs.writeFileSync('src/components/ApplicationDetailsModal.jsx', content, 'utf8');
  console.log('Successfully moved COMMENTS block to persistent layout in ApplicationDetailsModal.jsx');
} else {
  console.error('documentsEnd marker not found');
}
