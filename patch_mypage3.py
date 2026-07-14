import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
content = content.replace("import React, { useState } from 'react';", "import React, { useState, useCallback } from 'react';\nimport Cropper from 'react-easy-crop';")

# Add state variables
state_vars = """  const [editProfileImg, setEditProfileImg] = useState('');
  const [cropImgUrl, setCropImgUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);"""
content = re.sub(r"  const \[editProfileImg, setEditProfileImg\] = useState\(''\);", state_vars, content)

# Replace handleImageChange
old_handler = r"""  const handleImageChange = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{.*?  \};\n"""
new_handler = """  const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      img.src = imageSrc;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const handleCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (cropImgUrl && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(cropImgUrl, croppedAreaPixels);
      if (croppedImage) {
        setEditProfileImg(croppedImage);
      }
    }
    setCropImgUrl(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImgUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
"""
content = re.sub(old_handler, new_handler, content, flags=re.DOTALL)

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
