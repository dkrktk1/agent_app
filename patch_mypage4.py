import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

cropper_modal = """
      {cropImgUrl && (
        <div className="fixed inset-0 z-[1200] overflow-y-auto bg-black/80 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col p-6 animate-scale-up">
            <h3 className="text-lg font-bold text-white mb-4 text-center">사진 자르기</h3>
            
            <div className="relative w-full h-64 mb-4 bg-black/50 rounded-xl overflow-hidden">
              <Cropper
                image={cropImgUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="flex items-center gap-3 mb-6 px-2">
              <span className="material-icons-round text-gray-400 text-sm">zoom_out</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[var(--primary-color)]"
              />
              <span className="material-icons-round text-gray-400 text-sm">zoom_in</span>
            </div>
            
            <div className="flex gap-3">
              <button 
                className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-gray-400 font-bold hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                onClick={() => {
                  setCropImgUrl(null);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                }}
              >
                취소
              </button>
              <button 
                className="flex-1 py-3 rounded-xl bg-[var(--primary-color)] text-black font-bold hover:opacity-90 transition-opacity"
                onClick={handleCropSave}
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}"""

content = content.replace("      {showDeleteConfirm && (", cropper_modal + "\n      {showDeleteConfirm && (")

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
