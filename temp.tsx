                  <div className="flex flex-col gap-2 mt-2 shrink-0">
                    <div className="flex gap-2">
                      {isAgent && (
                        <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white" onClick={() => setShowDeleteConfirm(true)}>삭제</button>
                      )}
                      <button className="btn-primary flex-1" onClick={handleSaveProfile}>저장하기</button>
                    </div>
                  </div>
