import { ButtonComponent, Modal } from 'obsidian'

export default class RemoteUploadConfirmationDialog extends Modal {
  private userResponded = false

  private deferredResolve: (value: UploadConfirmationResponse) => void

  private resp = new Promise<UploadConfirmationResponse>((resolve) => {
    this.deferredResolve = resolve
  })

  async response(): Promise<UploadConfirmationResponse> {
    return this.resp
  }

  override onOpen(): void {
    this.titleEl.setText('Imgur plugin')
    this.contentEl.setText('Would you like to upload to Imgur or paste your content locally?')

    const buttonsDiv = this.modalEl.createDiv('modal-button-container')

    new ButtonComponent(buttonsDiv)
      .setButtonText('Always upload')
      .setCta()
      .onClick(() => {
        this.deferredResolve({ shouldUpload: true, alwaysUpload: true })
        this.afterUserInput()
      })

    new ButtonComponent(buttonsDiv)
      .setButtonText('Upload')
      .setCta()
      .onClick(() => {
        this.deferredResolve({ shouldUpload: true })
        this.afterUserInput()
      })

    new ButtonComponent(buttonsDiv).setButtonText('Paste locally').onClick(() => {
      this.deferredResolve({ shouldUpload: false })
      this.afterUserInput()
    })
  }

  private afterUserInput() {
    this.userResponded = true
    this.close()
  }

  override onClose(): void {
    if (!this.userResponded) this.deferredResolve({ shouldUpload: undefined })
  }
}

export interface UploadConfirmationResponse {
  shouldUpload: boolean | undefined
  alwaysUpload?: boolean
}
