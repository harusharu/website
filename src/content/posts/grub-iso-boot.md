---
title: "Install Linux Without USB: GRUB ISO Boot on Dual Boot"
description: "How to install Linux on a dual-boot system without a USB drive by booting an ISO from disk using GRUB."
date: "2026-02-20"
---

## Overview

This guide shows how to install a Linux distribution (CachyOS, Ubuntu, etc.) on a dual-boot system without using a USB drive, by booting the ISO directly from your hard disk using GRUB.

## Prerequisites

- An existing Linux installation with GRUB bootloader (Fedora, Ubuntu, etc.)
- An ISO file of the Linux distribution you want to install
- Free disk space on an **unencrypted** partition or separate hard drive
- Root/sudo access

## The Problem We Solved

GRUB cannot read files from encrypted (LUKS) partitions during boot. If your root partition is encrypted, you need to store the ISO on an unencrypted partition.

## Solution: Extract Kernel & Initrd Method

### Step 1: Prepare Storage Location

**Option A: If you have an ext4/ext3/ext2 partition:**

```bash
# Mount the partition
$ mount /dev/sdX1 /mnt/temp

# Copy ISO
$ cp ~/Downloads/your-distro.iso /mnt/temp/

# Get the UUID
$ blkid /dev/sdX1
```

**Option B: If you have exFAT partition (needs conversion):**

```bash
# Backup your data first!
# Convert to ext4 using GParted or:
$ umount /dev/sdX1
$ mkfs.ext4 /dev/sdX1

# Then mount and copy ISO
$ mount /dev/sdX1 /mnt/temp
$ cp ~/Downloads/your-distro.iso /mnt/temp/
$ blkid /dev/sdX1
```

**Option C: If partition is too small, create a new one:**

```bash
# Use GParted to:
# 1. Shrink existing partition
# 2. Create 5GB ext4 partition in unallocated space
# 3. Mount and copy ISO
```

### Step 2: Extract Kernel and Initrd from ISO

```bash
# Create mount point
$ mkdir -p /mnt/iso

# Mount the ISO
$ mount -o loop ~/Downloads/your-distro.iso /mnt/iso

# Find kernel and initrd locations
find /mnt/iso -name "vmlinuz*"
find /mnt/iso -name "initr*"

# Check the ISO's grub config for boot parameters
cat /mnt/iso/boot/grub/grub.cfg

# Copy kernel and initrd to /boot
$ cp /mnt/iso/path/to/vmlinuz-* /boot/
$ cp /mnt/iso/path/to/initramfs-* /boot/

# Verify
ls -lh /boot/vmlinuz-* /boot/initramfs-*

# Unmount ISO
$ umount /mnt/iso
```

### Step 3: Create GRUB Menu Entry

```bash
# Edit GRUB custom entries
$ nano /etc/grub.d/40_custom
```

Add this entry (adjust paths and parameters based on what you found in Step 2):

**For CachyOS:**

```bash
menuentry "CachyOS Installer" {
    insmod part_gpt
    insmod ext2
    search --no-floppy --fs-uuid --set=root YOUR-BOOT-PARTITION-UUID
    linux /vmlinuz-linux-cachyos archisobasedir=arch img_dev=/dev/sdX1 img_loop=/your-distro.iso copytoram
    initrd /initramfs-linux-cachyos.img
}
```

**For Ubuntu:**

```bash
menuentry "Ubuntu Installer" {
    insmod part_gpt
    insmod ext2
    search --no-floppy --fs-uuid --set=root YOUR-BOOT-PARTITION-UUID
    linux /vmlinuz boot=casper img_dev=/dev/sdX1 img_loop=/ubuntu.iso quiet splash
    initrd /initrd
}
```

**Important variables to replace:**

- `YOUR-BOOT-PARTITION-UUID` = UUID of your /boot partition (use `blkid /dev/nvmeXnYpZ` or `/dev/sdX`)
- `/dev/sdX1` = The partition where ISO is stored
- `/your-distro.iso` = Name of your ISO file
- Kernel/initrd names and boot parameters = From Step 2

### Step 4: Update GRUB

**For Fedora/RHEL-based:**

```bash
$ grub2-mkconfig -o /boot/grub2/grub.cfg
```

**For Debian/Ubuntu-based:**

```bash
$ update-grub
```

### Step 5: Reboot and Install

1. Reboot your computer
2. Select your custom installer entry from GRUB menu
3. The live environment will boot
4. Install the distro normally

**Installation Options:**

- **Dual Boot:** Install on a separate partition or the unused HDD
- **Replace Existing:** Erase current OS and install new one

## Important UUIDs Reference

Find your partition UUIDs:

```bash
# See all partitions
lsblk -fa

# Get specific UUID
$ blkid /dev/sdX1
```

Common partitions:

- `/boot` partition (ext4) - This is where we copy kernel/initrd
- ISO storage partition (ext4) - Where the .iso file lives
- EFI partition (vfat) - Keep this for dual boot

## Troubleshooting

### Error: "no such device: UUID"

- GRUB can't find the partition
- Check UUID is correct: `sudo blkid`
- Make sure partition is **not encrypted**

### Error: "file not found"

- ISO path is wrong
- Verify: `sudo mount /dev/sdX1 /mnt/temp && ls /mnt/temp/`

### Error: "you need to load the kernel first"

- Boot parameters are wrong
- Mount ISO and check `/mnt/iso/boot/grub/grub.cfg` for correct parameters
- Make sure kernel and initrd paths match what you copied to `/boot`

### Error: exFAT module not found

- GRUB doesn't support exFAT well
- Convert partition to ext4 or create new ext4 partition

### /boot partition full

- Don't copy ISO to `/boot` - it's too small
- Only copy kernel (~17MB) and initrd (~76MB) to `/boot`
- Store ISO on root partition or separate drive

## Example: Real Working Configuration

**System:**

- Fedora 43 on encrypted NVMe drive
- 1TB HDD with ext4 partition

**Files:**

```text
/dev/sda1 (ext4, UUID: d95c77d1-8cd4-4b14-9865-954436110ccb)
  └── cachyos-desktop-linux-260124.iso

/boot (ext4, UUID: a02ac6ca-790c-498b-93fc-82d6d66fdc56)
  ├── vmlinuz-linux-cachyos
  └── initramfs-linux-cachyos.img
```

**GRUB Entry:**

```bash
menuentry "CachyOS Installer" {
    insmod part_gpt
    insmod ext2
    search --no-floppy --fs-uuid --set=root a02ac6ca-790c-498b-93fc-82d6d66fdc56
    linux /vmlinuz-linux-cachyos archisobasedir=arch img_dev=/dev/sda1 img_loop=/cachyos-desktop-linux-260124.iso copytoram
    initrd /initramfs-linux-cachyos.img
}
```

## Why This Method Works

1. **Kernel and initrd** are loaded directly from `/boot` (unencrypted, GRUB can access)
2. **ISO file** is stored on unencrypted partition (HDD in our case)
3. **Boot parameters** tell the kernel where to find the ISO (`img_dev` and `img_loop`)
4. **copytoram** loads everything into RAM, so you can even erase the current OS during installation

## After Installation

Once installed, the new OS will add itself to GRUB automatically. You'll have:

- Your original OS (Fedora)
- Your new OS (CachyOS/Ubuntu)
- Both bootable from GRUB menu

## Cleanup (Optional)

After successful installation, you can remove the installer files:

```bash
# Succesfull cleanup
$ rm /boot/vmlinuz-linux-cachyos
$ rm /boot/initramfs-linux-cachyos.img
$ rm /mnt/temp/cachyos-desktop-linux-260124.iso
$ grub2-mkconfig -o /boot/grub2/grub.cfg
```

## Notes

- This method works for most Arch-based and Debian-based distributions
- Boot parameters vary by distro - always check the ISO's grub.cfg
- Keep your EFI partition intact for dual booting
- Some distros use `archisobasedir`, others use `boot=casper`
- The `copytoram` parameter is crucial if you plan to erase the current OS
