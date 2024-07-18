"use client"

import { Button } from "@/components/ui/button"
import { useAccount } from "@/lib/providers/jazz-provider"
import { ContentHeader } from "./content-header"
import styles from "./wrapper.module.css"
import { cn } from "@/lib/utils"
import { EllipsisIcon, HeartIcon, LinkIcon, ListFilterIcon } from "lucide-react"

export const InboxWrapper = () => {
  const account = useAccount()

  return (
    <div>
      <ContentHeader />

      <div className="p-4">
        <div
          className={cn(
            styles.cUsGzh,
            styles.bnpsoX,
            styles.ctlcle,
            styles.crCnxt
          )}
        >
          <form className={styles.kDYmDY}>
            <div className={cn(styles.kGpKyG, styles.kDhpYL)}>
              <div className={styles.iGlOFZ}>
                <div className={styles.kOcDcH}>
                  <div className={styles.fhSUXx}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      aria-label="Choose icon"
                      className="size-7 text-primary/60"
                    >
                      <LinkIcon size={16} />
                    </Button>
                    <input
                      name="name"
                      type="text"
                      autoComplete="off"
                      maxLength={100}
                      placeholder="All projects"
                      data-1p-ignore="true"
                      className={cn(
                        styles.exJbsT,
                        styles.kchywm,
                        "focus-visible:outline-none"
                      )}
                      value=""
                    />
                  </div>
                  <div className={cn(styles.eaCPrZ, styles.fuUmfB)}>
                    <div className={cn(styles.jSNbJn)}>
                      <button type="button" className={styles.cxWyDa}>
                        Cancel
                      </button>
                      <button type="submit" className={styles.iIDZOH}>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
                <div className={cn(styles.jSNbJn, styles.jdIqEO)}>
                  <input
                    name="description"
                    type="text"
                    autoComplete="off"
                    placeholder="Description (optional)"
                    maxLength={255}
                    data-1p-ignore="true"
                    className={cn(
                      styles.exJbsT,
                      styles.kFCftf,
                      "focus-visible:outline-none"
                    )}
                    value=""
                  />
                </div>
              </div>
            </div>
            <div className={cn(styles.isqrdV, styles.kHkngo)}>
              <div className={styles.bnRnXO}>
                <div className={styles.jiVIkv}>
                  <div
                    className={cn(styles.kGpKyG, styles.fXWmGw, styles.iNMQmf)}
                    data-menu-open="false"
                  >
                    <Button
                      size="sm"
                      type="button"
                      variant="ghost"
                      className="gap-x-2 text-sm"
                    >
                      <ListFilterIcon size={16} className="text-primary/60" />
                      <span className="hidden md:block">Filter</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className={cn(styles.dulHiZ, styles.gdAyQK)}>
                <div className={styles.sMyPm}>
                  <div
                    className={cn(styles.kGpKyG, styles.fXWmGw, styles.liWHAH)}
                    data-menu-open="false"
                  >
                    <Button
                      size="icon"
                      type="button"
                      variant="ghost"
                      className="gap-x-2 text-sm"
                    >
                      <EllipsisIcon size={16} className="text-primary/60" />
                    </Button>
                    <Button
                      size="icon"
                      type="button"
                      variant="ghost"
                      className="gap-x-2 text-sm"
                    >
                      <HeartIcon size={16} className="text-primary/60" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
